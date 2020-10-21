<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WeatherImage;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index(){
        $weather_images = WeatherImage::where('delete_flg', 'flase')->orderByDesc('updated_at')->get();
        
        return view('home', compact('weather_images'));
    }
}
