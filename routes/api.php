<?php

use App\Http\Controllers\AIController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\MapboxGeocodeController;
use App\Models\City;
use App\Models\Ward;

// ========= CHAT BOT AI ===============
Route::post('/chat', [ChatController::class, 'chat']);

// ========= GỌI API GỢI Ý TIÊU ĐỀ VÀ MÔ TẢ ==============
Route::post('/ai/generate-post', [AIController::class, 'generate']);

// ========= GỌI API PHƯỜNG / XÃ ==============
Route::get('/regions/cities', function () {
    return City::all();
});
Route::get('/regions/wards/{city_id}', function ($city_id) {
    return Ward::where('city_id', $city_id)->get();
});

Route::post('/mapbox/geocode', [MapboxGeocodeController::class, 'geocode']);
Route::post('/mapbox/autocomplete', [MapboxGeocodeController::class, 'autocomplete']);
