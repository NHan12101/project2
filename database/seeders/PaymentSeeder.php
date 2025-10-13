<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;
use App\Models\User;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        for ($i = 0; $i < 50; $i++) {
            Payment::create([
                'user_id' => User::inRandomOrder()->first()->id,
                'method'  => $faker->randomElement(['momo', 'bank', 'cash']),
                'amount'  => $faker->randomFloat(2, 100000, 5000000),
            ]);
        }
    }
}
