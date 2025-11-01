<?php

use App\Http\Controllers\Api\ChatController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController as ChatBotAiController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\PostController;
use App\Models\User;

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
})->name('home');

// ===== PROPERTY DETAIL =====
Route::get('/property-detail', fn() => Inertia::render('PropertyDetail'))->name('property-detail');

// ===== TRANG ĐĂNG KÝ / ĐĂNG NHẬP =====
// ⚠️ Quan trọng: thêm GET routes để hiển thị giao diện đăng nhập/đăng ký
Route::get('/login', fn() => Inertia::render('Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Register'))->name('register');

// ===== XỬ LÝ FORM ĐĂNG KÝ / ĐĂNG NHẬP / ĐĂNG XUẤT =====
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

//=== TRANG BLOGS====
Route::get('/blogs', function () {
    return Inertia::render('Blogs');
});

// Route mở trang chi tiết blog
Route::get('/blogsdetail', function () {
    return Inertia::render('BlogsDetail');
})->name('blogsdetail');


//=== TRANG BLOGS====
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


// ========== CHAT ROUTES ==========
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/chatbox', function () {
        return Inertia::render('ChatBox/ChatIndex', [
            'userId' => Auth::id(),
        ]);
    })->name('chatbox.chatindex');

    // Route::get('/chatbox/{id}', function ($id) {
    //     $conversation = \App\Models\Conversation::findOrFail($id);

    //     // ✅ Chặn người không thuộc hội thoại
    //     if (!in_array(Auth::id(), [$conversation->user_one_id, $conversation->user_two_id])) {
    //         abort(403, 'Unauthorized access to this conversation');
    //     }

    //     return Inertia::render('ChatBox/ChatShow', [
    //         'conversationId' => (int) $id,
    //         'userId' => Auth::id(),
    //     ]);
    // })->name('chatbox.chatshow');
});

Route::get('/posts', [PostController::class, 'index']);


// ========== PROFILE ROUTES ==========
Route::middleware(['auth', 'verified'])->group(function () {

    // 🔹 Trang hồ sơ người dùng
    Route::get('/profile/{id}', function ($id) {
        $user = User::findOrFail($id);
        return Inertia::render('Profile/Show', [
            'user' => $user,
            'currentUserId' => Auth::id(),
        ]);
    })->name('profile.show');
});

// ========== Gọi Api của messages ==========
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/conversations', [ChatController::class, 'index']);
    Route::get('/conversations/{conversationId}/messages', [ChatController::class, 'messages']);
    Route::post('/messages/send', [ChatController::class, 'sendMessage']);
    Route::post('/messages/read', [ChatController::class, 'markAsRead']);
    Route::post('/conversations/start', [ChatController::class, 'startConversation']);
    Route::get('/conversations/{id}', [ChatController::class, 'show']);
});

// ========= chat ai ===============
Route::get('/chat', function () {
    return Inertia::render('Chat'); // Đây là React page bạn đang code
});
Route::post('/chat', [ChatBotAiController::class, 'chat']);


Route::get('/property-detail/{id}', [PostController::class, 'show']);