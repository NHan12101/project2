<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

// Import các command của bạn
use App\Console\Commands\HideExpiredPosts;
use App\Console\Commands\NotifyExpiringPosts;
use App\Console\Commands\CleanupDraftPosts;

class Kernel extends ConsoleKernel
{
    /**
     * Các command custom của ứng dụng
     *
     * @var array
     */
    protected $commands = [
        HideExpiredPosts::class,
        NotifyExpiringPosts::class,
        CleanupDraftPosts::class,
    ];

    /**
     * Định nghĩa lịch chạy (cron)
     */
    protected function schedule(Schedule $schedule): void
    {
        // Ẩn bài hết hạn – chạy mỗi phút (test)
        $schedule->command('posts:hide-expired')->everyMinute();

        // Thông báo sắp hết hạn (24h)
        $schedule->command('posts:notify-expiring')->hourly();

        // Dọn draft cũ
        $schedule->command('cleanup:draft-posts')->daily();
    }

    /**
     * Đăng ký command
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
