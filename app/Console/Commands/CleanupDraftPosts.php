<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post;

class CleanupDraftPosts extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cleanup:draft-posts';

    /**
     * The console command description.
     */
    protected $description = 'Xoá các bài đăng ở trạng thái draft quá hạn và dọn ảnh/video trên R2';

    public function handle()
    {
        $expiredDrafts = Post::where('status', 'draft')
            ->where('last_activity_at', '<', now()->subMinutes(1))->get();

        if ($expiredDrafts->isEmpty()) {
            $this->info('Không có draft nào cần dọn.');
            return Command::SUCCESS;
        }

        foreach ($expiredDrafts as $post) {
            $post->delete(); // model lo R2
            $this->line("Đã xoá draft post ID: {$post->id}");
        }

        $this->info('Dọn dẹp draft hoàn tất');
        return Command::SUCCESS;
    }
}
