<?php

namespace App\Http\Controllers;

use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            // Nếu lỗi InvalidStateException -> thử dùng stateless()
            $googleUser = Socialite::driver('google')->stateless()->user();
        }

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'avatar_image_url' => $googleUser->getAvatar(),
                'password' => bcrypt(str()->random(16)),
            ]
        );

        Auth::login($user);

        return redirect('/home');
    }
}
