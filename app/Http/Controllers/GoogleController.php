<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            // Một số phiên Google không có state → fallback sang stateless
            $googleUser = Socialite::driver('google')->stateless()->user();
        }

        // 🔍 Kiểm tra user tồn tại
        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            Auth::login($user);
            return redirect('/home');
        }

        // ⚙️ Nếu chưa có → lưu session tạm để người dùng nhập mật khẩu bổ sung
        session([
            'google_user' => [
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'avatar' => $googleUser->getAvatar(),
            ],
        ]);

        return redirect()->route('complete.register');
    }

    // 🔒 Trang nhập mật khẩu sau khi đăng ký bằng Google
    public function showCompleteRegister()
    {
        $googleUser = session('google_user');
        if (!$googleUser) {
            return redirect('/login');
        }

        return inertia('CompleteGoogleRegister', [
            'googleUser' => $googleUser,
        ]);
    }

    // 📝 Xử lý lưu mật khẩu mới
    public function completeRegister(Request $request)
    {
        $request->validate([
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[!@#$%^&*_\-])[^\s]+$/',
            ],
        ]);

        $googleUser = session('google_user');
        if (!$googleUser) {
            return redirect('/login');
        }

        $user = User::create([
            'name' => $googleUser['name'],
            'email' => $googleUser['email'],
            'avatar_image_url' => $googleUser['avatar'],
            'password' => bcrypt($request->password),
        ]);

        // 🧹 Xóa session tạm
        session()->forget('google_user');
        Auth::login($user);

        return redirect('/home');
    }
}
