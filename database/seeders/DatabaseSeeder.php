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
            CitySeeder::class,
            WardSeeder::class,
            // PaymentSeeder::class,
            SubscriptionSeeder::class,
            UtilitySeeder::class,
            PersonalAccessTokenSeeder::class,
            PostSeeder::class,
        ]);
    }
}
