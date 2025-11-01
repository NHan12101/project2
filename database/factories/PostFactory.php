<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(6),
            'description' => $this->faker->paragraph(5),
            'price' => $this->faker->randomFloat(2, 50000000, 5000000000), // 50tr–5tỷ
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
            'location_id' => Location::inRandomOrder()->first()->id,
        ];
    }
}
