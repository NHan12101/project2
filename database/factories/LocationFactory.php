<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LocationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'City' => $this->faker->city(),
            'Ward' => $this->faker->streetName(),
            'Longitude' => $this->faker->longitude(105, 110),
            'Latitude' => $this->faker->latitude(10, 23),
        ];
    }
}
