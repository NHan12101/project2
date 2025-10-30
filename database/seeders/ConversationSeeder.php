<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conversation;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        Conversation::truncate();

        Conversation::create([
            'user_one_id' => 1,
            'user_two_id' => 2,
        ]);
    }
}
