<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subscription;
use App\Models\User;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        foreach (User::all() as $user) {
            Subscription::create([
                'user_id'    => $user->id,
                'package'    => $faker->randomElement(['basic', 'pro', 'premium']),
                'start_date' => $faker->dateTimeBetween('-1 year', 'now'),
                'end_date'   => $faker->dateTimeBetween('now', '+1 year'),
            ]);
        }
    }
}
