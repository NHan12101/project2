<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Message;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        Message::truncate();

        Message::create([
            'conversation_id' => 1,
            'sender_id' => 1,
            'message' => 'Xin chao, ban khoe khong?',
        ]);

        Message::create([
            'conversation_id' => 1,
            'sender_id' => 2,
            'message' => 'Toi khoe, cam on ban! Con ban thi sao?',
        ]);
    }
}
