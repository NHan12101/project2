<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suggest extends Model
{
    protected $fillable = [
        'keyword_raw',
        'phrase_display',
        'type',
        'post_count',
        'weight',
    ];

    public $timestamps = true;
}
