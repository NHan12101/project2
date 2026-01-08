<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Post;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'phone',
        'avatar_image_url',
        'avatar',
        'notification',
        'phone_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime'
    ];

    protected $appends = ['avatar_url'];

    // Gán ảnh mặc định cho user không có avatar khi được tạo mới
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->avatar_image_url) && empty($user->avatar)) {
                $user->avatar_image_url = 'images/ava2.jpg';
            }
        });
    }

    // Accessor trả về URL ảnh đại diện phù hợp
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar_image_url) {
            return asset($this->avatar_image_url);
        }

        if ($this->avatar) {
            return $this->avatar;
        }

        return asset('images/default-avatar.jpg');
    }


    // Quan hệ: 1 user có nhiều bài đăng
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function viewedPosts()
    {
        return $this->belongsToMany(Post::class, 'post_view_histories')
            ->withPivot('viewed_at')
            ->orderByDesc('post_view_histories.viewed_at');
    }
}
