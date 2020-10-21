<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WeatherImage;

class WeatherImageController extends Controller
{
    //
    public function create(Request $request){
        $validatedData = $request->validate([
            'info' => ['required'],
            'name' => ['required'],
            'weather_image' => ['required'],
            'start_id' => ['required'],
            'end_id' => ['required'],
        ]);
        
        // 画像ファイルを取得
        $logo_image = $request->file('weather_image');
        // 取得した画像ファイルをstorage/app/public/内にフォルダを作って保存
        $temp_path = $logo_image->store('public/weather_images');
        // 上のファイルを読み込む用のパスを作成(IPアドレス/admin/storage/...)
        $read_temp_path = str_replace('public/', 'storage/', $temp_path);
    
        $weather_image = new WeatherImage();
        
        $weather_image->image_path = $read_temp_path;
        $weather_image->info = $request->info;
        $weather_image->name = $request->name;
        $weather_image->start_id = $request->start_id;
        $weather_image->end_id = $request->end_id;
        
        $weather_image->save();
        return redirect('/home');
    }

    public function delete($id){
        $weather_image = WeatherImage::where('id', $id)->where('delete_flg', 'flase')->first();
        $weather_image->delete_flg = true;
        $weather_image->save();

        return redirect('/home');
    }

    // api

    public function read(){
        $weather_images = WeatherImage::where('delete_flg', 'false')->get();

        return [
            "result" => "ok",
            "weather_images" => $weather_images
        ];
    }
}
