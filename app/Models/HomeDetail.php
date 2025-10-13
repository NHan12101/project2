<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeDetail extends Model
{
    use HasFactory;

    protected $table = 'homedetails'; // trỏ đúng tên bảng

    protected $fillable = [
        'title',
        'description',
        'price',
        'location',
        'address',
        'areage',
        'utilities',
        'user_id',
        'category_id',
    ];
}
