<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HomeDetail;
use App\Models\PostImage;

class PostImageSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        foreach (HomeDetail::all() as $home) {
            for ($i = 0; $i < rand(1, 3); $i++) {
                PostImage::create([
                    'post_id' => $home->id,
                    'image_path'  => $faker->imageUrl(640, 480, 'house', true),
                ]);
            }
        }
    }
}
