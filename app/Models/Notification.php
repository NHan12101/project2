<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type', // expiring, expired, payment, system
        'data',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'data' => 'array'
    ];

    // Mỗi thông báo thuộc về 1 user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Nếu thông báo liên quan tới bài post
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
