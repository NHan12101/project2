<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(6),
            'price' => fake()->numberBetween(1, 20) . ' tỷ',
            'bedrooms' => fake()->numberBetween(1, 5),
            'area' => fake()->numberBetween(50, 200),
            'location' => fake()->city() . ', ' . fake()->state(),
            'posted_at' => 'Đăng hôm nay',
            'is_Vip' => fake()->boolean(30),
        ];
    }
}
