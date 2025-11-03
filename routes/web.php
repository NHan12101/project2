<?php

use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\PostController;

// ===== TRANG MẶC ĐỊNH =====
Route::get('/', function () {
    return redirect('/home');
});

// ===== TRANG HOME =====
Route::get('/home', [PostController::class, 'index'])->name('home');

// ===== PROPERTY DETAIL =====
Route::get('/property-detail/{id}', [PostController::class, 'show']);

// ===== TRANG ĐĂNG KÝ / ĐĂNG NHẬP =====
// ⚠️ Quan trọng: thêm GET routes để hiển thị giao diện đăng nhập/đăng ký
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Register'))->name('register');


// ===== XỬ LÝ FORM ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT =====
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

//=== TRANG BLOGS ====
Route::get('/blogs', function () {
    return Inertia::render('Blogs');
});
// Route mở trang chi tiết blog
Route::get('/blogsdetail', function () {
    return Inertia::render('BlogsDetail');
})->name('blogsdetail');

//=== TRANG PROFILE ====
Route::get('/profile', function () {
    return Inertia::render('Profile');
});

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

// ========== CHAT BOX ROUTES ==========
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/chatbox', function () {
        return Inertia::render('ChatBox/ChatIndex', [
            'userId' => Auth::id(),
        ]);
    })->name('chatbox.chatindex');
});

// ========== PROFILE ROUTES ==========
Route::middleware(['auth', 'verified'])->group(function () {

    // Trang hồ sơ người dùng
    Route::get('/profile/{id}', function ($id) {
        $user = User::findOrFail($id);
        return Inertia::render('Profile/Show', [
            'user' => $user,
            'currentUserId' => Auth::id(),
        ]);
    })->name('profile.show');
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
