<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use Carbon\Carbon;

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
        // Set fake "now" cho tất cả Carbon::now()
        // Carbon::setTestNow('2026-01-10 12:00:00');
        //php artisan posts:hide-expired

        $now = Carbon::now();

        $expiredPosts = Post::where('status', 'visible')
            ->whereNotNull('package_expired_at')
            ->where('package_expired_at', '<=', $now)
            ->get();

        foreach ($expiredPosts as $post) {
            $post->update([
                'status' => 'hidden'
            ]);
        }

        $this->info($expiredPosts->count() . ' bài đăng đã được ẩn.');
    }
}
