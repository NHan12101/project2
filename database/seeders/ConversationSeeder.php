<?php

namespace Database\Seeders;

use App\Models\Conversation;
use Illuminate\Database\Seeder;
use App\Models\User;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 50; $i++) {
            Conversation::create([
                'user_id' => User::inRandomOrder()->first()->id,
                'title'   => $faker->sentence(3), // có thể là tên chủ đề chat
            ]);
        }
    }
}

