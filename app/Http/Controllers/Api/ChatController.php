<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ChatService;

class ChatController extends Controller
{
    public function chat(Request $request, ChatService $chatService)
    {
        try {
            $content = $chatService->handle(
                $request->input('messages', [])
            );

            return response()->json([
                'content' => $content
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'content' => 'Hệ thống đang bận, vui lòng thử lại.'
            ], 500);
        }
    }
}
