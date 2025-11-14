<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class WardSeeder extends Seeder
{
    public function run(): void
    {
        $wardNames = [
            'Phường 1', 'Phường 2', 'Phường 3',
            'Phường 4', 'Phường 5', 'Phường 6',
            'Phường 7', 'Phường 8', 'Phường 9',
            'Phường 10', 'Phường 11', 'Phường 12',
        ];

        City::all()->each(function ($city) use ($wardNames) {
            $names = collect($wardNames)->shuffle()->take(8); // mỗi city 8 phường
            foreach ($names as $name) {
                $city->wards()->create([
                    'name' => $name
                ]);
            }
        });
    }
}
