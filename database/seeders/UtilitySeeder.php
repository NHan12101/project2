<?php

namespace Database\Seeders;

use App\Models\Utility;
use Illuminate\Database\Seeder;

class UtilitySeeder extends Seeder
{
    public function run(): void
    {
        $utilities = [
            'Điều hòa',
            'Tủ lạnh',
            'Máy giặt',
            'Wifi',
            'Bể bơi',
            'Ban công',
            'Thang máy',
            'Bãi đỗ xe',
            'Gym',
            'An ninh 24/7'
        ];

        foreach ($utilities as $name) {
            Utility::firstOrCreate(['name' => $name]);
        }
    }
}
