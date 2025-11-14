<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class City extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

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
