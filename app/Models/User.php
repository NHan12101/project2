<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = ['avatar_url'];

    /**
     * Gán ảnh mặc định cho user không có avatar khi được tạo mới
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            // Nếu không có ảnh từ Google hoặc upload thủ công -> gán ảnh mặc định
            if (empty($user->avatar_image_url) && empty($user->avatar)) {
                $user->avatar_image_url = 'images/ava2.jpg';
            }
        });
    }

    /**
     * Accessor trả về URL ảnh đại diện phù hợp
     */
    public function getAvatarUrlAttribute()
    {
        // Nếu user đã upload ảnh riêng
        if ($this->avatar_image_url) {
            return asset($this->avatar_image_url);
        }

        // Nếu user đăng ký bằng Google và có ảnh
        if ($this->avatar) {
            return $this->avatar;
        }

        // Nếu không có ảnh nào -> dùng ảnh mặc định
        return asset('images/default-avatar.jpg');
    }
}
