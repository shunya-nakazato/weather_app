<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/users', [App\Http\Controllers\AppUserController::class, 'index'])->name('users_list');
Route::post('/weather_image/create', [App\Http\Controllers\WeatherImageController::class, 'create'])->name('weather_image_create');
Route::get('/weather_image/delete/{id}', [App\Http\Controllers\WeatherImageController::class, 'delete'])->name('weather_image_delete');
