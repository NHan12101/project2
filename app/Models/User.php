<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Các cột có thể gán giá trị hàng loạt (mass assignable)
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'notification',
    ];

    /**
     * Các cột sẽ được ẩn khi trả về JSON hoặc mảng
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * Ép kiểu cho các trường dữ liệu
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
