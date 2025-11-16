<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    use HasFactory;

    protected $fillable = [
        'ward_name',
        'ward_code',
        'city_id'
    ];

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
