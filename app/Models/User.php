<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable //implements MustVerifyEmail
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

    // ✅ Accessor xử lý tự động ảnh đại diện
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
}
