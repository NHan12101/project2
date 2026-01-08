<?php

namespace App\Http\Controllers;

use App\Models\PhoneOtp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;

class PhoneOtpController extends Controller
{
    public function sendOtp(Request $request, $phone = null, $type = 'verify_phone')
    {
        $phone = $phone ?? $request->phone;

        Validator::validate(['phone' => $phone], [
            'phone' => ['required', 'regex:/^0[0-9]{9}$/'],
        ], ['phone' => 'Vui lòng nhập đúng định dạng']);

        $user = $request->user();

        // Kiểm tra số điện thoại đã có người dùng khác
        $existingUser = User::where('phone', $phone)->first();
        if ($existingUser && $existingUser->id !== $user?->id) {
            return back()->withErrors([
                'message' => 'Số điện thoại này đã được sử dụng',
            ]);
        }

        // ===== Rate limit: 1 phút / số =====
        if (RateLimiter::tooManyAttempts("send-phone-otp:" . $phone, 1)) {
            return back()->withErrors([
                'message' => 'Vui lòng đợi 1 phút trước khi gửi OTP mới',
            ]);
        }
        RateLimiter::hit("send-phone-otp:" . $phone, 60);

        // ===== Xoá OTP cũ =====
        PhoneOtp::where('phone', $phone)->delete();

        $otp = random_int(100000, 999999);

        PhoneOtp::create([
            'user_id'    => $user?->id,
            'phone'      => $phone,
            'otp'        => Hash::make($otp),
            'expires_at' => now()->addMinutes(5),
            'attempts'   => 0,
            'type'       => $type,
        ]);

        /**
         * TODO: tích hợp SMS provider
         */
        logger()->info('PHONE OTP', [
            'phone' => $phone,
            'otp'   => $otp,
        ]);

        return back()->with([
            'phone_otp_required' => true,
            'phone' => $phone,
        ]);
    }


    /**
     * Xác thực OTP
     */
    public function verifyOtp(Request $request)
    {
        Validator::validate($request->all(), [
            'phone' => ['required', 'regex:/^0[0-9]{9}$/'],
            'otp'   => ['required', 'digits:6'],
        ]);

        $phone = $request->phone;
        $otpInput = $request->otp;

        $otpRecord = PhoneOtp::where('phone', $phone)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otpRecord) {
            return back()->withErrors([
                'message' => 'OTP đã hết hạn, vui lòng yêu cầu OTP mới',
            ]);
        }

        // ===== Giới hạn 5 lần nhập sai =====
        if ($otpRecord->attempts >= 5) {
            $otpRecord->delete();

            return back()->withErrors([
                'message' => 'Bạn đã nhập sai quá số lần cho phép',
            ]);
        }

        if (!Hash::check($otpInput, $otpRecord->otp)) {
            $otpRecord->increment('attempts');

            return back()->withErrors([
                'message' => 'OTP không đúng',
            ]);
        }

        // ===== OTP đúng =====
        $user = User::find($otpRecord->user_id);

        $otpRecord->delete();

        if (!$user) {
            return back()->withErrors([
                'message' => 'Không tìm thấy user',
            ]);
        }

        // Kiểm tra số điện thoại có user khác chưa
        $otherUser = User::where('phone', $phone)->where('id', '!=', $user->id)->first();
        if ($otherUser) {
            return back()->withErrors(['message' => 'Số điện thoại này đã được người khác xác thực']);
        }

        $user->update([
            'phone'             => $phone,
            'phone_verified_at' => now(),
        ]);

        Auth::setUser($user->fresh());

        return redirect()->intended(route('posts.create'))
            ->with('success', 'Xác thực số điện thoại thành công');
    }
}
