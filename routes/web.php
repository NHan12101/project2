<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleController;

/*
|--------------------------------------------------------------------------
| GIAO DIỆN FRONTEND
|--------------------------------------------------------------------------
*/
Route::get('/', fn() => Inertia::render('Login'))->name('custom.login');
Route::get('/register', fn() => Inertia::render('Register'))->name('register');
Route::get('/home', fn() => Inertia::render('Home', [
    'auth' => ['user' => auth()->user()],
]))->middleware('auth')->name('home');

/*
|--------------------------------------------------------------------------
| XỬ LÝ AUTH (ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

/*
|--------------------------------------------------------------------------
| GOOGLE LOGIN
|--------------------------------------------------------------------------
*/
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');
