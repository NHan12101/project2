<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AIContentService
{
    public function generatePost(array $data): array
    {
        $prompt = $this->buildPrompt($data);

        $raw = match (config('services.provider')) {
            'groq'   => $this->callGroq($prompt),
            'openai' => $this->callOpenAI($prompt),
            default  => throw new \Exception('AI provider not supported'),
        };

        return $this->parseAndValidate($raw);
    }

    /* ================= PROMPT ================= */

    private function buildPrompt(array $data): string
    {
        return <<<PROMPT
Bạn là AI chuyên viết nội dung bất động sản tại Việt Nam.

NHIỆM VỤ:
- Viết 1 tiêu đề (tối thiểu 30 ký tự và tối đa 88 ký tự)
- Xác định đúng loại bất động sản theo category_id:
  1 = căn hộ
  2 = nhà phố
  3 = biệt thự
  4 = phòng trọ
  5 = studio
- Xác định người dùng đăng cho thuê hay bán theo type:
  rent = Cho thuê + tên bất động sản theo category_id + với diện tích là bao nhiêu + thành phố nào
  sale = Bán + tên bất động sản theo category_id + với diện tích là bao nhiêu + thành phố nào
- Viết 1 nội dung bài đăng theo đúng FORM bên dưới

FORM NỘI DUNG (VIẾT ĐÚNG THỨ TỰ):
1. Dòng mô tả tổng quan (1–2 câu) dựa vào loại bất động sản, địa chỉ và diện tích, KẾT THÚC bằng ký tự \\n
2. Danh sách đặc điểm, mỗi ý bắt đầu bằng "+", các ý cách nhau bằng ký tự \\n
3. 1 đoạn mô tả tiện ích xung quanh, KẾT THÚC bằng ký tự \\n
4. 1 dòng kêu gọi hành động (liên hệ)

QUY TẮC BẮT BUỘC:
- Viết tiếng Việt
- Không emoji
- Không markdown
- Không văn phong phóng đại
- Giá nhiều số 0 phải đổi sang triệu / tỷ
- KHÔNG xuống dòng thật, CHỈ dùng ký tự \\n
- CHỈ được trả về JSON hợp lệ, không thêm bất kỳ chữ nào khác

THÔNG TIN NGƯỜI DÙNG:
{$this->formatUserData($data)}

TRẢ VỀ DUY NHẤT JSON:
{
  "title": "...",
  "description": "..."
}
PROMPT;
    }

    private function formatUserData(array $data): string
    {
        return collect($data)
            ->filter(fn($v) => is_scalar($v) || is_null($v))
            ->map(fn($v, $k) => "- {$k}: " . ($v === null ? 'null' : $v))
            ->implode("\n");
    }

    /* ================= PROVIDERS ================= */

    private function baseMessages(string $prompt): array
    {
        return [
            [
                'role' => 'system',
                'content' =>
                'Bạn chỉ được phép trả về JSON hợp lệ. ' .
                    'Không markdown. Không chú thích. Không văn bản dư thừa.'
            ],
            [
                'role' => 'user',
                'content' => $prompt
            ],
        ];
    }

    private function callGroq(string $prompt): string
    {
        $res = Http::withToken(config('services.groq.key'))
            ->post(config('services.groq.base_url') . '/chat/completions', [
                'model'       => config('services.groq.model'),
                'messages'    => $this->baseMessages($prompt),
                'temperature' => 0.6,
                'max_tokens'  => 900,
            ])
            ->throw()
            ->json();

        return $res['choices'][0]['message']['content'] ?? '';
    }

    private function callOpenAI(string $prompt): string
    {
        $res = Http::withToken(config('services.openai.key'))
            ->post('https://api.openai.com/v1/chat/completions', [
                'model'       => config('services.openai.model'),
                'messages'    => $this->baseMessages($prompt),
                'temperature' => 0.6,
                'max_tokens'  => 900,
            ])
            ->throw()
            ->json();

        return $res['choices'][0]['message']['content'] ?? '';
    }

    /* ================= PARSE + VALIDATE ================= */

    private function parseAndValidate(string $content): array
    {
        // 1. Trim + bỏ markdown fence nếu có
        $content = trim(preg_replace('/```(json)?/i', '', $content));

        // 2. Chỉ chấp nhận JSON ở cuối chuỗi
        if (!preg_match('/\{\s*"title"\s*:\s*[\s\S]*\}$/', $content, $m)) {
            throw new \Exception("AI response does not contain valid JSON block.\nRAW:\n{$content}");
        }

        $json = $m[0];

        // 3. Ép description an toàn (chỉ còn \\n)
        $json = preg_replace_callback(
            '/"description"\s*:\s*"([\s\S]*?)"/',
            function ($match) {
                $safe = str_replace(
                    ["\r\n", "\r", "\n", "\t"],
                    ["\\n", "\\n", "\\n", " "],
                    $match[1]
                );
                return '"description":"' . $safe . '"';
            },
            $json
        );

        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \Exception(
                'Invalid JSON from AI: ' . json_last_error_msg() . "\nRAW:\n" . $json
            );
        }

        // 4. Validate logic tối thiểu
        if (
            empty($data['title']) ||
            empty($data['description']) ||
            !str_contains($data['description'], '+')
        ) {
            throw new \Exception('AI returned incomplete or invalid content structure.');
        }

        return [
            'title'       => Str::limit(trim($data['title']), 88, ''),
            'description' => Str::limit(trim($data['description']), 2000, ''),
        ];
    }
}
