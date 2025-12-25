<?php

namespace App\Models;

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
    ];

    // Ẩn bài đăng có status là 'hidden'
    // protected static function booted()
    // {
    //     static::addGlobalScope('visible', function ($query) {
    //         $query->where('status', 'visible');
    //     });
    // }

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
}
