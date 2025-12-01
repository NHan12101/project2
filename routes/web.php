<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\EmailOtpController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\PaymentController;

// ===== TRANG MẶC ĐỊNH =====
Route::get('/', function () {
    return redirect()->route('home');
});

// ===== TRANG HOME =====
Route::get('/home', [PostController::class, 'index'])->name('home');

// ===== PROPERTY DETAIL =====
Route::get('/property-detail/{id}', [PostController::class, 'show']);

// ===== XỬ LÝ FORM ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT =====
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ===== XÁC THỰC / GỬI LẠI OTP =========
Route::post('/verify-otp', [EmailOtpController::class, 'verifyOtp'])->name('otp.verify');
Route::post('/resend-otp', [EmailOtpController::class, 'sendOtp'])->name('otp.resend');

// ===== QUÊN MẬT KHẨU =============
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetOtp']);
Route::post('/forgot-password/reset', [ForgotPasswordController::class, 'resetPassword']);

//=== TRANG BLOGS ====
Route::get('/blogs', function () {
    return Inertia::render('Blogs');
});
// Route mở trang chi tiết blog
Route::get('/blogsdetail', function () {
    return Inertia::render('BlogsDetail');
})->name('blogsdetail');

//=== TRANG PROFILE ====
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [UserController::class, 'show'])->name('profile.show');
    Route::post('/profile/update', [UserController::class, 'storeOrUpdate'])->name('profile.update');
});

// ===== GOOGLE LOGIN =====
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('google.redirect'); 
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('google.callback');

// Trang hoàn tất đăng ký sau khi đăng nhập bằng Google
Route::get('/complete-register', fn() => Inertia::render('CompleteRegister'))->name('complete.register');
Route::post('/complete-register', [GoogleController::class, 'completeRegister']);

// Email xác minh
// Auth::routes(['verify' => true]);

// Trang yêu cầu xác minh email
Route::get('/force-logout', function () {
    return Inertia::render('ForceLogout');
});

// ========== CHAT BOX ROUTES ==========
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/chatbox', function () {
        return Inertia::render('ChatBox/ChatIndex', [
            'userId' => Auth::id(),
        ]);
    })->name('chatbox.chatindex');
});

// ========== Gọi API CỦA MESSAGES ==========
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/conversations', [ChatController::class, 'index']);
    Route::get('/conversations/{conversationId}/messages', [ChatController::class, 'messages']);
    Route::post('/messages/send', [ChatController::class, 'sendMessage']);
    Route::post('/messages/read', [ChatController::class, 'markAsRead']);
    Route::post('/conversations/start', [ChatController::class, 'startConversation']);
    Route::get('/conversations/{id}', [ChatController::class, 'show']);
});

// ========== TẠO BÀI POST ================
Route::middleware(['auth'])->group(function () {
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
});

Route::post('/payments/create', [PaymentController::class, 'create']);

// Payment Result Pages
Route::get('/payments/success', function () {
    return "Payment Success!";
});

Route::get('/payments/cancel', function () {
    return "Payment Cancelled!";
});

// PayPal return
Route::get('/payments/paypal/return', function () {
    return "PayPal Payment Success!";
});

Route::get('/payments/paypal/cancel', function () {
    return "PayPal Payment Cancelled!";
});

// MoMo return
Route::get('/payments/momo/return', function () {
    return "MoMo Payment Success!";
});

Route::post('/payments/momo/ipn', function () {
    return "MoMo IPN Received!";
});

// VNPAY return
Route::get('/payments/vnpay/return', function () {
    return "VNPAY Payment Success!";
});

Route::get('/payment', function () {
    return Inertia::render('Payment');
});

// ========== BỘ LỌC ======///////
Route::get('/home-finder', [FilterController::class, 'index']);
