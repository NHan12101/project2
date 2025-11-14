<?php

namespace Database\Factories;

use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    protected $model = City::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->randomElement([
                'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
                'Bình Dương', 'Đồng Nai', 'Khánh Hòa', 'Bà Rịa - Vũng Tàu', 'Long An',
                'Tiền Giang', 'Vĩnh Long', 'An Giang', 'Kiên Giang', 'Bắc Ninh'
            ]),
        ];
    }
}