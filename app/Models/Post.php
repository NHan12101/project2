<?php

namespace App\Models;

use Aws\S3\S3Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'address',
        'address_detail',
        'area',
        'bedrooms',
        'bathrooms',
        'livingrooms',
        'kitchens',
        'status',
        'type',
        'user_id',
        'category_id',
        'city_id',
        'ward_id',
        'subscription_id',
        'package_expired_at',
        'slug',
        'latitude',
        'longitude',
        'floors',
        'direction',
        'legal',
        'furniture',
        'video',
        'youtube_url',
        'last_activity_at',
    ];

    protected $casts = [
        'package_expired_at' => 'datetime',
    ];

    // Ẩn bài đăng có status là 'hidden'
    // protected static function booted()
    // {
    //     static::addGlobalScope('visible', function ($query) {
    //         $query->where('status', 'visible');
    //     });
    // }

    // Tự động xóa ảnh và video trên R2 khi bài post bị xóa
    protected static function booted()
    {
        static::deleting(function (Post $post) {

            $client = new S3Client([
                'version' => 'latest',
                'region' => 'auto',
                'endpoint' => config('filesystems.disks.r2.endpoint'),
                'credentials' => [
                    'key' => config('filesystems.disks.r2.key'),
                    'secret' => config('filesystems.disks.r2.secret'),
                ],
            ]);

            $prefix = "posts/{$post->id}/";

            try {
                $objects = $client->listObjectsV2([
                    'Bucket' => config('filesystems.disks.r2.bucket'),
                    'Prefix' => $prefix,
                ]);

                if (!empty($objects['Contents'])) {
                    $client->deleteObjects([
                        'Bucket' => config('filesystems.disks.r2.bucket'),
                        'Delete' => [
                            'Objects' => collect($objects['Contents'])
                                ->map(fn($obj) => ['Key' => $obj['Key']])
                                ->toArray(),
                        ],
                    ]);
                }
            } catch (\Throwable $e) {
                logger()->error('Delete R2 folder failed', [
                    'post_id' => $post->id,
                    'error' => $e->getMessage(),
                ]);
            }
        });
    }

    // Quan hệ: mỗi bài viết thuộc về 1 người dùng
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ: mỗi bài viết thuộc về 1 danh mục
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Quan hệ: mỗi bài viết thuộc về 1 địa điểm
    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    // Quan hệ: mỗi bài viết có nhiều hình ảnh
    public function images()
    {
        return $this->hasMany(PostImage::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function utilities()
    {
        return $this->belongsToMany(Utility::class, 'post_utilities');
    }

    public function viewers()
    {
        return $this->belongsToMany(User::class, 'post_view_histories')
            ->withPivot('viewed_at');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'user_id');
    }
}
