<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleController;

// ===== TRANG MẶC ĐỊNH =====
Route::get('/', function () {
    return redirect('/home');
});

// ===== TRANG HOME =====
Route::get('/home', function () {
    return Inertia::render('Home', [
        'auth' => [
            'user' => Auth::user(), // null nếu chưa đăng nhập
        ],
    ]);
});

// ===== PROPERTY DETAIL =====
Route::get('/property-detail', fn() =>
    Inertia::render('PropertyDetail', [
        'auth' => ['user' => Auth::user()],
    ])
)->middleware('auth')->name('property-detail');

// ===== TRANG ĐĂNG KÝ / ĐĂNG NHẬP =====
// ⚠️ Quan trọng: thêm GET routes để hiển thị giao diện đăng nhập/đăng ký
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Register'))->name('register');

// ===== XỬ LÝ FORM ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT =====
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ===== GOOGLE LOGIN =====
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Trang hoàn tất đăng ký sau khi đăng nhập bằng Google
Route::get('/complete-register', fn() => Inertia::render('CompleteRegister'))->name('complete.register');
Route::post('/complete-register', [GoogleController::class, 'completeRegister']);

// ✅ Email xác minh
// Auth::routes(['verify' => true]);

// Trang yêu cầu xác minh email
Route::get('/force-logout', function () {
    return Inertia::render('ForceLogout');
});
