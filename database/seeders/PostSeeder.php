<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        if (!User::exists()) {
            $this->command->warn('Chưa có User!');
            return;
        }
        if (!Category::exists()) {
            $this->command->warn('Chưa có Category!');
            return;
        }
        if (!Ward::exists()) {
            $this->command->error('Chưa có Ward! Hãy chạy CitySeeder và WardSeeder trước!');
            return;
        }

        $images = [
            'images/home1.png',
            'images/home2.png',
            'images/home3.png',
        ];

        Post::factory(80)->create()->each(function ($post) use ($images) {

            $ward = Ward::inRandomOrder()->first();   // Lấy ward ngẫu nhiên

            $post->update([
                'user_id'     => User::inRandomOrder()->first()->id,
                'category_id' => Category::inRandomOrder()->first()->id,
                'city_id' => $ward->city_id,
                'ward_id' => $ward->id,
            ]);

            foreach ($images as $img) {
                PostImage::create([
                    'post_id'    => $post->id,
                    'image_path' => $img,
                ]);
            }
        });


        $this->command->info('  Done!!');
    }
}
