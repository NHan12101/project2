<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'City',
        'Ward',
        'Longitude',
        'Latitude',
    ];

    // Quan hệ: 1 location có thể có nhiều bài đăng
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
