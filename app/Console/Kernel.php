<?php

namespace App\Console;

use App\Console\Commands\HideExpiredPosts;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array<int, class-string>
     */
    protected $commands = [
        // Đăng ký command của bạn
        HideExpiredPosts::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Chạy command kiểm tra bài hết hạn mỗi 5 phút
        $schedule->command('posts:hide-expired')->everyMinute(); /// everyMinute // everyFiveMinutes

        // Nếu muốn chạy hàng ngày lúc 0:00
        // $schedule->command('posts:hide-expired')->dailyAt('00:00');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        // Load các lệnh trong thư mục Commands
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
