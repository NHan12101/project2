<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'name',
        'price_per_day',
        'currency',
        'priority'
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
