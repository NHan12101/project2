<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {

        // ✅ Thêm "System Prompt" để hướng dẫn chatbot
        $systemPrompt = [
            'role' => 'system',
            'content' => "
            Bạn là trợ lý ảo tên là LandSMate, hoạt động trên website bất động sản.
            Nhiệm vụ của bạn:
            - Hỗ trợ người dùng tìm nhà thuê, mua bán đất hoặc hướng dẫn đăng tin.
            - Trả lời đặc biệt ngắn gọn, đúng trọng tâm, thân thiện, dễ hiểu, ưu tiên tiếng Việt.
            - Khi người dùng hỏi về quy trình hoặc chính sách, hãy giải thích rõ ràng và gợi ý thao tác trên website.
            - Không cung cấp lời khuyên đầu tư, giá cụ thể, hoặc thông tin ngoài trang web.
            - Nếu người dùng hỏi ngoài lĩnh vực bất động sản, hãy lịch sự từ chối và hướng họ quay lại chủ đề chính.
            "
        ];

        $userMessages = $request->input('messages', []);

        // ✅ Ghép system prompt + hội thoại người dùng
        $messages = array_merge([$systemPrompt], $userMessages);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
            'Content-Type'  => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => $messages,
            'temperature' => 0.6,
        ]);

        $data = $response->json();
        $content = $data['choices'][0]['message']['content'] ?? '[Không có phản hồi]';

        return response()->json([
            'content' => $content,
            'raw' => $data,
        ]);
    }
}
