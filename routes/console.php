<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// === ĐỊNH NGHĨA SCHEDULED TASKS TẠI ĐÂY ===
Schedule::command('posts:hide-expired')
    ->everyMinute()  // everyMinute // everyFiveMinutes
    ->description('Ẩn các bài đăng hết hạn gói đăng ký');

// Chạy command dọn dẹp bản nháp đã hết hạn
Schedule::command('cleanup:draft-posts')
    ->everyMinute() //dailyAt('03:00');
    ->description('Xoá các bài đăng ở trạng thái draft quá hạn và dọn ảnh/video trên R2');

// Schedule::command('posts:notify-expiring')
//     ->dailyAt('00:00')
//     ->description('Thông báo bài viết sắp hết hạn');
