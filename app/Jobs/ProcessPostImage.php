<?php

namespace App\Jobs;

use App\Models\PostImage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProcessPostImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public int $postImageId) {}

    public function handle()
    {
        $image = PostImage::find($this->postImageId);
        if (!$image) return;

        if ($image->medium_path && $image->thumb_path) {
            return;
        }

        $manager = new ImageManager(new Driver());

        $originalPath = storage_path("app/public/{$image->image_path}");

        if (!file_exists($originalPath)) {
            return;
        }

        // ===== MEDIUM =====
        $mediumPath = str_replace('original_', 'medium_', $image->image_path);

        $manager->read($originalPath)
            ->scaleDown($image->is360 ? 3072 : 1600)
            ->toWebp(75)
            ->save(storage_path("app/public/{$mediumPath}"));

        // ===== THUMB =====
        $thumbPath = str_replace('original_', 'thumb_', $image->image_path);

        $manager->read($originalPath)
            ->scaleDown($image->is360 ? 512 : 400)
            ->toWebp(70)
            ->save(storage_path("app/public/{$thumbPath}"));

        gc_collect_cycles();

        // update DB (giữ nguyên schema)
        $image->update([
            'medium_path' => $mediumPath,
            'thumb_path'  => $thumbPath,
        ]);
    }
}
