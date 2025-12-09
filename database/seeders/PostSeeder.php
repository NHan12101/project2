<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\PostImage;
use App\Models\User;
use App\Models\Utility;
use App\Models\Ward;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

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

        if (!Utility::exists()) {
            $this->command->warn('Chưa có Utility!');
        }

        $images = [
            'posts/home1.png',
            'posts/home2.png',
            'posts/home3.png',
            'posts/home4.png',
            'posts/home5.png',
            'posts/home6.png',
        ];

        $utilities = Utility::all();

        Post::factory(4000)->create()->each(function ($post) use ($images, $utilities) {

            $ward = Ward::inRandomOrder()->first();   // Lấy ward ngẫu nhiên

            $post->update([
                'user_id'     => User::inRandomOrder()->first()->id,
                'category_id' => Category::inRandomOrder()->first()->id,
                'city_id' => $ward->city_id,
                'ward_id' => $ward->id,
                'slug' => Str::slug($post->title) . '-' . $post->id, // tạo slug luôn
            ]);

            // Thêm ảnh ngẫu nhiên
            $randomImages = collect($images)->shuffle();
            foreach ($randomImages as $img) {
                PostImage::create([
                    'post_id'    => $post->id,
                    'image_path' => $img,
                ]);
            }

            // --- Thêm tiện ích ngẫu nhiên ---
            if ($utilities->count() > 0) {
                $numUtilities = rand(1, 5); // mỗi post có 1-5 tiện ích
                $randomUtilities = $utilities->shuffle()->take($numUtilities);

                foreach ($randomUtilities as $utility) {
                    $post->utilities()->attach($utility->id);
                }
            }
        });

        $this->command->info('  Done!!');
    }
}
