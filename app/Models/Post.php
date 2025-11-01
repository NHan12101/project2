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
        'area',
        'bedrooms',
        'bathrooms',
        'livingrooms',
        'kitchens',
        'status',
        'type',
        'user_id',
        'category_id',
        'location_id',
    ];

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
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
