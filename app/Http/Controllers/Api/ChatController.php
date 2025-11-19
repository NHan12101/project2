<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $userMessages = $request->input('messages', []);
        // Lấy post từ DB → convert thành text
        $posts = Post::orderBy('created_at', 'desc')
            ->take(5)
            ->get(['title', 'price', 'address'])
            ->map(fn($p) => "{$p->title}, giá {$p->price}đ, tại {$p->address}")
            ->implode("\n");

        $systemPrompt = [
            'role' => 'system',
            'content' => "
                Bạn là LandMate – trợ lý bất động sản.
                Đây là 5 tin đăng mới nhất trên website:
                $posts
                Khi trả lời:
                - Nếu người dùng hỏi về phòng hoặc giá, hãy ưu tiên dùng dữ liệu bên trên.
                - Trả lời ngắn, tiếng Việt, không suy đoán.
            "
        ];
        $messages = array_merge([$systemPrompt], $userMessages);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
            'Content-Type'  => 'application/json',
        ])->post("https://api.groq.com/openai/v1/chat/completions", [
            "model" => "llama-3.3-70b-versatile",
            "messages" => $messages,
            "temperature" => 0.5
        ]);

        return response()->json([
            "content" => $response->json("choices.0.message.content")
        ]);
    }
}
