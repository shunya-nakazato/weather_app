<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Like;

class LikeController extends Controller
{
    //
    public function store(Request $request){
        $like = Like::where("app_user_id", $request->id)->where("lat", $request->lat)->where("lng", $request->lng)->first();
        if ($like) {
            return [
                "result" => "already",
            ];
        } else {
            $like = new Like();
            $like->app_user_id = $request->id;
            $like->lat = $request->lat;
            $like->lng = $request->lng;
            $like->save();

            return [
                "result" => "ok",
                "like" => $like
            ];
        }
    }

    public function read($app_user_id){
        $likes = Like::where("app_user_id", $app_user_id)->get();

        if ($likes) {
            return [
                "result" => "ok",
                "likes" => $likes
            ];
        } else {
            return [
                "result" => "ng"
            ];
        }
    }

    public function delete($id){
        Like::where('id', $id)->delete();

        return [
            "result" => "ok"
        ];
    }
}
