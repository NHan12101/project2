<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use App\Models\HomeDetail;
use App\Models\User;
use Faker\Factory as Faker;

class HomeDetailSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Lấy user & category có sẵn (hoặc random ID nếu bạn seed trước rồi)
        $users = User::pluck('id')->toArray();
        $categories = Category::pluck('id')->toArray();

        for ($i = 0; $i < 50; $i++) {
            HomeDetail::create([
                'title'       => $faker->sentence(3),
                'description' => $faker->paragraph(),
                'price'       => $faker->numberBetween(1000000, 5000000),
                'location'    => $faker->city,
                'address'     => $faker->address,
                'areage'      => $faker->numberBetween(30, 200),
                'utilities'   => json_encode([
                    'bedroom'           => $faker->numberBetween(1, 5),
                    'kitchen'           => $faker->boolean,
                    'bathroom'          => $faker->numberBetween(1, 3),
                    'electricity_water' => $faker->randomElement(['chung', 'riêng']),
                ]),
                'user_id'     => $faker->randomElement($users),
                'category_id' => $faker->randomElement($categories),
            ]);
        }
    }
}
