<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EmailOtp;
use App\Mail\SendOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\RateLimiter;

class EmailOtpController extends Controller
{
    /**
     * Gửi OTP tới email
     */
    public function sendOtp(Request $request, $email = null, $type = 'register')
    {
        $email = $email ?? $request->email;

        Validator::validate(['email' => $email], [
            'email' => 'required|email'
        ]);

        // ======= Giới hạn gửi OTP: 1 phút =========
        if (RateLimiter::tooManyAttempts("send-otp:" . $email, 1)) {
            return back()->withErrors([
                'message' => 'Vui lòng đợi 1 phút trước khi gửi OTP mới'
            ]);
        }
        RateLimiter::hit("send-otp:" . $email, 60);

        // ======= Xóa OTP cũ ========
        EmailOtp::where('email', $email)->delete();

        // ======== Tạo OTP 6 chữ số =========
        $otp = rand(100000, 999999);

        $user = User::where('email', $email)->first();

        // ========= Lưu OTP đã hash ========
        EmailOtp::create([
            'user_id' => $user?->id,
            'email' => $email,
            'otp' => Hash::make($otp),
            'expires_at' => now()->addMinutes(5),
            'attempts' => 0,
            'type' => $type,
        ]);

        // ========= Gửi Email bằng Mailable ========
        Mail::to($email)->send(new SendOtpMail($otp));

        return back()->with('success', 'OTP đã được gửi, vui lòng kiểm tra email');
    }

    /**
     * Xác thực OTP
     */
    public function verifyOtp(Request $request)
    {
        Validator::validate($request->all(), [
            'email' => 'required|email',
            'otp'   => 'required|digits:6'
        ]);

        $email = $request->email;
        $otpInput = $request->otp;

        // ======== Lấy OTP còn hạn ========
        $otpRecord = EmailOtp::where('email', $email)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otpRecord) {
            return back()->withErrors([
                'message' => 'OTP đã hết hạn, vui lòng yêu cầu OTP mới'
            ]);
        }

        // =========== Giới hạn 5 lần nhập sai =============
        if ($otpRecord->attempts >= 5) {

            $otpRecord->delete(); // tự hủy luôn

            return back()->withErrors([
                'message' => 'Bạn đã nhập sai quá số lần cho phép, vui lòng yêu cầu OTP mới'
            ]);
        }

        // ========== Kiểm tra OTP ==========
        if (!Hash::check($otpInput, $otpRecord->otp)) {
            $otpRecord->increment('attempts');

            return back()->withErrors(['message' => 'OTP không đúng']);
        }

        // Lưu trước rồi mới xóa
        $type = $otpRecord->type;
        $userId = $otpRecord->user_id;

        // ============ OTP đúng thì xóa bản ghi =============
        $otpRecord->delete();

        // Quên mật khẩu thì vào đây
        if ($type === 'forgot_password') {
            
            return back()->with([
                'reset_password_allowed' => true,
                'email' => $email,
            ]);
        }

        // =========== Nếu user tồn tại -> verify email ===========
        if ($userId) {
            $user = User::find($userId);

            if ($user) {
                $user->email_verified_at = now();
                $user->save();

                Auth::login($user);
                return redirect()->route('home');
            }
        }

        return back()->withErrors(['message' => 'Không tìm thấy user để login.']);
    }
}
