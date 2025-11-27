<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $messages = [
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'email.unique' => 'Email đã được sử dụng.',
            'password.required' => 'Mật khẩu là bắt buộc.',
            'password.string' => 'Mật khẩu phải là chuỗi ký tự.',
            'password.min' => 'Mật khẩu phải ít nhất 8 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'password.regex' => 'Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.',
        ];

        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/'
                /**
             * Giải thích cho mấy con gà biết nè =))
                    (?=.*[a-z])                     -> ít nhất 1 chữ thường
                    (?=.*\d)                        -> ít nhất 1 số
                    (?=.*[!@#$%^&*()\-_=+{};:,<.>]) -> ít nhất 1 ký tự đặc biệt
                    .{8,}                           -> tối thiểu 8 ký tự
             */
            ],
        ], $messages);

        // Làm sạch dữ liệu đầu vào chặn icon... ngăn tấn công XSS =)))
        $cleanEmail = trim(strip_tags($validated['email']));

        $user = User::create([
            'email' => $cleanEmail,
            'password' => bcrypt($validated['password']),
            'email_verified_at' => null, // chưa verify
        ]);

        // Gửi OTP
        app(EmailOtpController::class)->sendOtp($request, $user->email);

        // trả về flash cho frontend
        return back()->with([
            'otp_required' => true,
            'otp_type' => 'register',
            'email' => $user->email,
            'success' => 'Vui lòng kiểm tra email để nhận OTP.',
        ]);
    }

    public function login(Request $request)
    {
        $messages = [
            'email.required' => 'Email là bắt buộc.',
            'email.email' => 'Email không hợp lệ.',
            'password.required' => 'Mật khẩu là bắt buộc.',
        ];

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], $messages);

        $user = User::where('email', $credentials['email'])->first();

        // Kiểm tra user tồn tại và đã verify email chưa
        if (!$user || !Hash::check($credentials['password'], $user->password)) {

            return back()->withErrors([
                'email' => 'Email hoặc mật khẩu không đúng'
            ]);
        }

        // Nếu chưa verify email -> yêu cầu OTP lại
        if ($user && !$user->email_verified_at) {

            app(EmailOtpController::class)->sendOtp($request, $user->email); // Gửi lại OTP

            return back()->with([
                'otp_required' => true,
                'email' => $user->email,
                'otp_type' => 'register',
                'success' => 'Tài khoản chưa xác thực. Vui lòng nhập OTP.',
            ]);
        }

        // Email đã verify thì login luôn xờiiii
        $remember = $request->boolean('remember'); // đọc từ frontend

        Auth::login($user, $remember); // truyền remember
        $request->session()->regenerate();


        return redirect('/home');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/force-logout');
    }
}
