<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use App\Models\City;
use App\Models\Ward;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),
            'slug' => null,
            'description' => $this->faker->paragraph(16),
            'price' => $this->faker->numberBetween(500000000, 50000000000), // 500tr–50tỷ
            'address' => $this->faker->address(),
            'area' => $this->faker->randomFloat(2, 30, 500),
            'bedrooms' => $this->faker->numberBetween(1, 6),
            'bathrooms' => $this->faker->numberBetween(1, 4),
            'livingrooms' => $this->faker->numberBetween(1, 3),
            'kitchens' => $this->faker->numberBetween(1, 2),
            'status' => $this->faker->randomElement(['hidden', 'visible']),
            'type' => $this->faker->randomElement(['rent', 'sale']),
            'user_id' => User::inRandomOrder()->first()->id,
            'category_id' => Category::inRandomOrder()->first()->id,
            'city_id' => City::inRandomOrder()->value('id'),
            'ward_id' => Ward::inRandomOrder()->value('id'),

            'latitude' => $this->faker->randomFloat(7, 10.0000000, 22.5000000),
            'longitude' => $this->faker->randomFloat(7, 102.0000000, 110.0000000),

            'floors' => $this->faker->numberBetween(1, 12),
            'direction' => $this->faker->randomElement(['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Tây Nam', 'Đông Bắc', 'Tây Bắc']),
            'legal' => $this->faker->randomElement(['Sổ hồng', 'Sổ đỏ', 'Hợp đồng mua bán', 'Giấy tay']),
            'furniture' => $this->faker->randomElement(['Đầy đủ', 'Cơ bản', 'Không nội thất']),
        ];
    }
}
