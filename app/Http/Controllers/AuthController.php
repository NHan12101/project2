<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        // Làm sạch dữ liệu đầu vào (chặn icon hoặc HTML)
        $cleanEmail = strip_tags($validated['email']);

        $user = User::create([
            'email' => $cleanEmail,
            'password' => bcrypt($validated['password']),
        ]);

        // 🔥 Gửi email xác minh
        event(new Registered($user));

        Auth::login($user);

        return redirect('/home');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect('/home');
        }

        return back()->withErrors([
            'email' => 'Mật khẩu hoặc Email không đúng!',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/force-logout');
    }
}
