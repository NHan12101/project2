<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;

// ========= CHAT BOT AI ===============
Route::get('/chat', function () {
    return Inertia::render('Chat');
});
Route::post('/chat', [ChatController::class, 'chat']);
