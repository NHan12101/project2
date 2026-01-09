<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PostPackageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\EmailOtpController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PhoneOtpController;
use App\Http\Controllers\PostViewedController;
use App\Http\Controllers\R2Controller;

// ===== TRANG MẶC ĐỊNH =====
Route::get('/', function () {
    return redirect()->route('home');
});

// ===== TRANG HOME =====
Route::get('/home', [PostController::class, 'index'])->name('home');

// ===== PROPERTY DETAIL =====
Route::get('/property-detail/{slug}', [PostController::class, 'show'])->name('propertyDetail.show');

// ===== XỬ LÝ FORM ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT =====
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ===== XÁC THỰC / GỬI LẠI OTP =========
Route::post('/verify-otp', [EmailOtpController::class, 'verifyOtp'])->name('otp.verify');
Route::post('/resend-otp', [EmailOtpController::class, 'sendOtp'])->name('otp.resend');

// ========== XÁC THỰC SMS ================
Route::middleware('auth')->group(function () {
    Route::post('/phone/send-otp', [PhoneOtpController::class, 'sendOtp'])->name('phone.send');
    Route::post('/phone/verify-otp', [PhoneOtpController::class, 'verifyOtp'])->name('phone.verify');
});

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

// ========== BỘ LỌC ========= //
Route::get('/home-finder', [FilterController::class, 'index']);

//  ========= YÊU THÍCH ===============
Route::middleware(['auth'])->group(function () {
    Route::get('/saved', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorite/toggle', [FavoriteController::class, 'toggle']);
    Route::post('/favorites/remove', [FavoriteController::class, 'remove']);
});


// ========== TẠO BÀI POST VÀ THANH TOÁN ================
Route::middleware(['auth', 'phone.verified'])->group(function () {
    Route::get('/posts/create', [PostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');

    Route::get('/payments/{payment}/create', [PaymentController::class, 'create'])->name('payments.create');
    Route::get('/payments/success', [PaymentController::class, 'success'])->name('payments.success');
    Route::get('/payments/cancel', [PaymentController::class, 'cancel'])->name('payments.cancel');
    Route::post('/payments/momo/ipn', [PaymentController::class, 'momoIpn'])->name('payment.momo.ipn');

    Route::post('/posts/{post}/package', [PostPackageController::class, 'store'])->name('posts.package.store');

    Route::post('/r2/presign', [R2Controller::class, 'presign']);
    Route::delete('/r2/delete', [R2Controller::class, 'delete']);
});


// ========== LỊCH SỬ XEM TIN ================
Route::middleware('auth')->get('/posts/viewed', [PostViewedController::class, 'index'])->name('posts.viewed');


// ========== TẠO THÔNG BÁO ================
Route::middleware('auth')->group(function () {
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});
