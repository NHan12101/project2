<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'image_path',
        'thumb_path',
        'medium_path',
        'is360'
    ];

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    protected $casts = [
        'is360' => 'boolean',
    ];
}
