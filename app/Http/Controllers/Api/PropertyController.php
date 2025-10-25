<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;

class PropertyController extends Controller
{
    public function index()
    {
        // Lấy tất cả properties kèm ảnh
        $properties = Property::with('images')->get();

        // Trả về JSON
        return response()->json($properties);
    }
}
