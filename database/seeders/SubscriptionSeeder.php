<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subscription;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $subscriptions = [
            [
                'name' => 'Gói cơ bản',
                'days' => 16, // Thời gian dùng thử
                'price' => 0,
                'currency' => 'VND',
            ],
            [
                'name' => 'Gói tiêu chuẩn',
                'days' => 7,
                'price' => 49000,
                'currency' => 'VND',
            ],
            [
                'name' => 'Gói VIP',
                'days' => 14,
                'price' => 98000,
                'currency' => 'VND',
            ],
            [
                'name' => 'Gói Siêu VIP',
                'days' => 30,
                'price' => 199000,
                'currency' => 'VND',
            ],
        ];

        foreach ($subscriptions as $sub) {
            Subscription::create($sub);
        }
    }
}
