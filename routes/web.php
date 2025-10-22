<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

// ===== TRANG GIAO DIỆN =====
Route::get('/', fn() => Inertia::render('Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Register'))->name('register');
Route::get('/home', fn() => Inertia::render('Home', [
    'auth' => ['user' => Auth::user()],
]))->middleware('auth')->name('home');

// ===== ĐĂNG NHẬP / ĐĂNG KÝ THƯỜNG =====
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    Auth::login($user);

    return redirect('/home');
});

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    if (Auth::attempt($credentials)) {
        $request->session()->regenerate();
        return redirect('/home');
    }

    return back()->withErrors([
        'email' => 'Thông tin đăng nhập không chính xác.',
    ]);
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
});

// ===== GOOGLE LOGIN =====
Route::get('/auth/google', fn() => Socialite::driver('google')->redirect());

Route::get('/auth/google/callback', function () {
    $googleUser = Socialite::driver('google')->user();

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
});
