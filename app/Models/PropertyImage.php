<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    use HasFactory;

    protected $table = 'property_images';

    protected $fillable = [
        'property_id',
        'image_path',
    ];

    public function homeDetail()
    {
        return $this->belongsTo(HomeDetail::class, 'property_id');
    }
}
