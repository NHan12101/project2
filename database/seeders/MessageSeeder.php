<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conversation;
use App\Models\Message;

class MessageSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        foreach (Conversation::all() as $conv) {
            for ($i = 0; $i < rand(5, 15); $i++) {
                Message::create([
                    'conversation_id' => $conv->id,
                    'sender_id'       => $conv->user_one,
                    'message'         => $faker->sentence,
                ]);
            }
        }
    }
}
