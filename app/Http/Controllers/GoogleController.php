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
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Tìm user theo email
        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            // CHƯA CÓ USER → TẠO MỚI
            $user = User::create([
                'name'              => $googleUser->getName(),
                'email'             => $googleUser->getEmail(),
                'google_id'         => $googleUser->getId(),
                'password'          => null, // ❌ KHÔNG CẦN PASSWORD
                'email_verified_at' => now(), // ✅ COI NHƯ ĐÃ VERIFY
            ]);
        } else {
            // ĐÃ CÓ USER → đảm bảo email đã verify
            if (!$user->email_verified_at) {
                $user->update([
                    'email_verified_at' => now(),
                ]);
            }
        }
        Auth::login($user);
        return redirect()->route('home');
    }

    // Trang nhập mật khẩu sau khi đăng ký bằng Google
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

    // Xử lý lưu mật khẩu mới
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
            'avatar' => $googleUser['avatar'],
            'password' => bcrypt($request->password),
        ]);

        // Xóa session tạm
        session()->forget('google_user');
        Auth::login($user);

        return redirect('/home');
    }
}
