<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            HomeDetailSeeder::class,
            PropertyImageSeeder::class,
            SubscriptionSeeder::class,
            PaymentSeeder::class,
            ConversationSeeder::class,
            MessageSeeder::class,
            PersonalAccessTokenSeeder::class,
        ]);
    }
}
