<?php

namespace App\Jobs;

use App\Models\PostImage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ProcessPostImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // retry & timeout cho job (ổn định hơn)
    public int $tries = 3;
    public int $timeout = 120;

    public function __construct(public int $postImageId) {}

    public function handle(): void
    {
        $image = PostImage::find($this->postImageId);
        if (!$image) return;

        // đã xử lý rồi thì bỏ qua
        if ($image->medium_path && $image->thumb_path) {
            return;
        }

        $disk = Storage::disk('r2');

        // kiểm tra file gốc tồn tại trên R2
        if (!$disk->exists($image->image_path)) {
            return;
        }

        static $manager;
        $manager ??= new ImageManager(new Driver());

        // ===== TẠO FILE TẠM =====
        $tmpDir = storage_path('app/tmp');
        if (!is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }

        $tmpOriginal = $tmpDir . '/' . Str::random(20) . '.orig';
        $tmpMedium   = $tmpDir . '/' . Str::random(20) . '.webp';
        $tmpThumb    = $tmpDir . '/' . Str::random(20) . '.webp';

        try {
            // ===== DOWNLOAD ORIGINAL TỪ R2 =====
            $stream = $disk->readStream($image->image_path);
            file_put_contents($tmpOriginal, stream_get_contents($stream));
            fclose($stream);

            $pathInfo = pathinfo($image->image_path);

            // ===== MEDIUM =====
            $mediumPath = $pathInfo['dirname'] . '/medium_' . $pathInfo['filename'] . '.webp';

            $manager->read($tmpOriginal)
                ->scaleDown(
                    width: $image->is360 ? 3072 : 1600
                )
                ->toWebp(75)
                ->save($tmpMedium);

            $disk->put($mediumPath, fopen($tmpMedium, 'r'));

            // ===== THUMB =====
            $thumbPath  = $pathInfo['dirname'] . '/thumb_' . $pathInfo['filename'] . '.webp';

            $manager->read($tmpOriginal)
                ->scaleDown($image->is360 ? 512 : 400)
                ->toWebp(70)
                ->save($tmpThumb);

            $disk->put($thumbPath, fopen($tmpThumb, 'r'));

            // ===== UPDATE DB =====
            $image->update([
                'medium_path' => $mediumPath,
                'thumb_path'  => $thumbPath,
            ]);
        } finally {
            // ===== CLEANUP (RẤT QUAN TRỌNG) =====
            @unlink($tmpOriginal);
            @unlink($tmpMedium);
            @unlink($tmpThumb);
            gc_collect_cycles();
        }
    }
}
