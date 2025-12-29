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
                'name' => 'Tin thường',
                'price_per_day' => 3600,
                'currency' => 'VND',
                'priority' => 1,
            ],
            [
                'name' => 'VIP Bạc',
                'price_per_day' => 70000,
                'currency' => 'VND',
                'priority' => 2,
            ],
            [
                'name' => 'VIP Vàng',
                'price_per_day' => 139800,
                'currency' => 'VND',
                'priority' => 3,
            ],
            [
                'name' => 'VIP Kim Cương',
                'price_per_day' => 364000,
                'currency' => 'VND',
                'priority' => 4,
            ],
        ];

        foreach ($subscriptions as $sub) {
            Subscription::create($sub);
        }
    }
}
