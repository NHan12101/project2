<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $messages = $request->input('messages', []);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
            'Content-Type'  => 'application/json',
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model' => 'llama-3.3-70b-versatile',
            'messages' => $messages,
            'temperature' => 0.6,
        ]);

        $data = $response->json();
        $content = $data['choices'][0]['message']['content'] ?? '[No response]';

        return response()->json([
            'content' => $content,
            'raw' => $data,
        ]);
    }
}
