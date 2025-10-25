<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PropertyController;

Route::middleware('api')->group(function () {
    Route::get('/properties', [PropertyController::class, 'index']);
});
