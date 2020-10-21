<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/v1/weather', [App\Http\Controllers\WeatherImageController::class, 'read']);
Route::post('/v1/app_user/login', [App\Http\Controllers\AppUserController::class, 'login']);
Route::post('/v1/app_user/register', [App\Http\Controllers\AppUserController::class, 'register']);
Route::post('/v1/app_user_likes/store', [App\Http\Controllers\LikeController::class, 'store']);
Route::get('/v1/app_user_likes/{app_user_id}', [App\Http\Controllers\LikeController::class, 'read']);
Route::delete('/v1/app_user_likes/delete/{id}', [App\Http\Controllers\LikeController::class, 'delete']);