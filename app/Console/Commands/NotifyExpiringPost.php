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

        // Lọc bài: chưa hết hạn, nhưng còn dưới 24h
        $posts = Post::whereNotNull('package_expired_at')
            ->where('package_expired_at', '>', $now)
            ->where('package_expired_at', '<=', $next24h)
            ->whereDoesntHave('notifications', function ($query) {
                $query->where('type', 'post_expiring');
            })
            ->get();

        foreach ($posts as $post) {

            Notification::create([
                'user_id' => $post->user_id,
                'type' => 'post_expiring',
                'message' => "Bài đăng '{$post->title}' của bạn sẽ hết hạn trong vòng 24 giờ.",
                'data' => [
                    'post_id' => $post->id,
                    'expired_at' => $post->package_expired_at,
                    'hour_left' => 24,
                ],
            ]);
        }

        $this->info($posts->count() . ' bài gần hết hạn đã được gửi thông báo.');
    }
}
