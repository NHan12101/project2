<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Aws\S3\S3Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class R2Controller extends Controller
{
    public function presign(Request $request)
    {
        $request->validate([
            'filename' => 'required|string',
            'post_id' => 'required|integer',
        ]);

        Post::where('id', $request->post_id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $ext = pathinfo($request->filename, PATHINFO_EXTENSION);

        $path = sprintf(
            'posts/%d/%s.%s',
            $request->post_id,
            Str::uuid(),
            $ext
        );

        $client = new S3Client([
            'version' => 'latest',
            'region' => 'auto',
            'endpoint' => config('filesystems.disks.r2.endpoint'),
            'credentials' => [
                'key' => config('filesystems.disks.r2.key'),
                'secret' => config('filesystems.disks.r2.secret'),
            ],
        ]);

        $cmd = $client->getCommand('PutObject', [
            'Bucket' => config('filesystems.disks.r2.bucket'),
            'Key' => $path,
        ]);

        $requestPresigned = $client->createPresignedRequest($cmd, '+10 minutes');

        return response()->json([
            'upload_url' => (string) $requestPresigned->getUri(),
            'path' => $path,
            'method' => 'PUT',
        ]);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        $client = new S3Client([
            'version' => 'latest',
            'region' => 'auto',
            'endpoint' => config('filesystems.disks.r2.endpoint'),
            'credentials' => [
                'key' => config('filesystems.disks.r2.key'),
                'secret' => config('filesystems.disks.r2.secret'),
            ],
        ]);

        $client->deleteObject([
            'Bucket' => config('filesystems.disks.r2.bucket'),
            'Key' => $request->path,
        ]);

        return response()->json(['success' => true]);
    }
}
