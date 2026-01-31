<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use Carbon\Carbon;
use App\Models\Notification;

class HideExpiredPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:hide-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ẩn các bài đăng hết hạn gói đăng ký';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $now = Carbon::now();

        $expiredPosts = Post::where('status', 'visible')
            ->whereNotNull('package_expired_at')
            ->where('package_expired_at', '<=', $now)
            ->get();

        foreach ($expiredPosts as $post) {
            $post->update([
                'status' => 'expired'
            ]);

            Notification::create([
                'user_id' => $post->user_id,
                'type' => 'post_expired',
                'data' => [
                    'post_id' => $post->id,
                    'title'   => $post->title,
                ],
            ]);
        }

        $this->info($expiredPosts->count() . ' bài đăng đã được ẩn.');
    }
}
