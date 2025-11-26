<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    public function sendResetOtp(Request $request)
    {
        $messages = [
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
        ];

        $request->validate([
            'email' => 'required|email'
        ], $messages);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Email không tồn tại.'
            ]);
        }

        // Gửi OTP
        app(EmailOtpController::class)->sendOtp($request, $user->email, 'forgot_password');

        return back()->with([
            'otp_required' => true,
            'otp_type' => 'forgot_password',
            'email' => $user->email,
            'success' => 'Vui lòng kiểm tra email để nhận OTP đặt lại mật khẩu.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $messages = [
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.string' => 'Mật khẩu phải là chuỗi ký tự.',
            'password.min' => 'Mật khẩu ít nhất 8 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'password.regex' => 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.',
        ];

        $data = $request->validate([
            'email' => 'required|email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/'
            ],
        ], $messages);

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'Email không tồn tại.'
            ]);
        }

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        Auth::login($user);

        return redirect('/home');
    }
}
