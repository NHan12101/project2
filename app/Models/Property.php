<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'price',
        'bedrooms',
        'area',
        'location',
        'posted_at', // ✅ sửa từ postedAt → posted_at
        'is_vip',    // ✅ sửa từ isVip → is_vip
    ];

    public function images()
    {
        return $this->hasMany(\App\Models\PropertyImage::class);
    }
}
