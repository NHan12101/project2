<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'order',
        'latitude',
        'longitude',
    ];

    protected static function booted()
    {
        static::addGlobalScope('ordered', function (Builder $builder) {
            $builder->orderBy('order');
        });
    }

    public function wards()
    {
        return $this->hasMany(Ward::class);
    }
    // một thành phố có nhiều bài đăng
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
