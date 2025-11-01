<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use App\Models\PostImage;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // 🔹 Đảm bảo có dữ liệu trước khi tạo bài viết
        if (User::count() === 0 || Category::count() === 0 || Location::count() === 0) {
            $this->command->warn('⚠️ Cần seed users, categories, và locations trước!');
            return;
        }

        // 🔹 Tạo 16 bài viết mẫu
        Post::factory(16)->create()->each(function ($post) {
            $post->user_id = User::inRandomOrder()->first()->id;
            $post->category_id = Category::inRandomOrder()->first()->id;
            $post->location_id = Location::inRandomOrder()->first()->id;
            $post->save();
        });

        Post::factory()->create()->each(function ($post) {
            $images = [
                'images/home1.png',
                'images/home2.png',
                'images/home3.png',
            ];
            foreach ($images as $img) {
                PostImage::create([
                    'post_id' => $post->id,
                    'image_path' => $img,
                ]);
            }
        });

        $this->command->info('✅ Đã tạo 16 bài viết mẫu thành công!');
    }
}
