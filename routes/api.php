<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\MapboxGeocodeController;
use App\Models\City;
use App\Models\Ward;

// ========= CHAT BOT AI ===============
Route::get('/chat', function () {
    return Inertia::render('Chat');
});
Route::post('/chat', [ChatController::class, 'chat']);

// ========= GỌI API PHƯỜNG / XÃ ==============
Route::get('/regions/cities', function () {
    return City::all();
});
Route::get('/regions/wards/{city_id}', function ($city_id) {
    return Ward::where('city_id', $city_id)->get();
});

Route::post('/mapbox/geocode', [MapboxGeocodeController::class, 'geocode']);
Route::post('/mapbox/autocomplete', [MapboxGeocodeController::class, 'autocomplete']);
