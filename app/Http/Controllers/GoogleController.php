<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class GoogleController extends Controller
{
    /**
     * Chuyển hướng người dùng đến trang đăng nhập Google.
     */
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Xử lý callback từ Google sau khi người dùng đăng nhập thành công.
     */
    public function callback(): RedirectResponse
    {
        try {
            // Một số môi trường localhost hoặc XAMPP có thể gặp lỗi "InvalidStateException"
            // Nên ta dùng stateless() để bỏ kiểm tra state khi cần
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Không thể đăng nhập bằng Google. Vui lòng thử lại.');
        }

        // Kiểm tra hoặc tạo mới user
        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName() ?? 'GoogleUser_' . uniqid(),
                'avatar_image_url' => $googleUser->getAvatar(),
                'password' => bcrypt(str()->random(16)),
            ]
        );

        Auth::login($user);

        return redirect('/home');
    }
}
