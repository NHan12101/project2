<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;
use App\Models\Notification;
use Carbon\Carbon;

class NotifyExpiringPosts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'posts:notify-expiring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Thông báo cho người dùng khi bài đăng sắp hết hạn (trong vòng 24 giờ).';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $now = Carbon::now();
        $next24h = $now->copy()->addDay();

        $posts = Post::whereNotNull('package_expired_at')
            ->where('package_expired_at', '>', $now)
            ->where('package_expired_at', '<=', $next24h)
            ->get();

        foreach ($posts as $post) {

            // ✅ CHECK TRÙNG THÔNG BÁO Ở ĐÂY
            $exists = Notification::where('user_id', $post->user_id)
                ->where('type', 'post_expiring')
                ->where('data->post_id', $post->id)
                ->exists();

            if ($exists) {
                continue;
            }

            Notification::create([
                'user_id' => $post->user_id,
                'type' => 'post_expiring',
                'data' => [
                    'post_id' => $post->id,
                    'title' => $post->title,
                    'expired_at' => $post->package_expired_at,
                ],
            ]);
        }

        $this->info('Notify expiring posts done');
    }
}
