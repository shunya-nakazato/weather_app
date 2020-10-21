<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AppUser;

class AppUserController extends Controller
{
    //
    public function index(){
        $app_users = AppUser::get();

        return view('app_user.list', compact('app_users'));
    }

    //    API
    public function register(Request $request){
    //    バリデーションとエラーメッセージの表示
        if(AppUser::where('email', $request->email)->first()){
            return [
                "result" => "ng",
                "error_message" => "このメールアドレスはすでに登録されています",
            ];
        }
        if(strlen($request->password) < 8){
            return [
                "result" => "ng",
                "error_message" => "パスワードは8文字以上で入力してください",
            ];
        }


        $app_user = new AppUser();
        $app_user->name = $request->name;
        $app_user->email = $request->email;
        $app_user->password = $request->password;
        $app_user->save();

        return [
            "result" => "ok",
            "app_user" => $app_user,
        ];
    }

    public function login(Request $request){
        $app_user = AppUser::where('email', '=', $request->email)->where('password', '=', $request->password)->first();

        // エラーメッセージの表示
        if($app_user){
            return [
                "result" => "ok",
                "app_user" => $app_user,
            ];
        }else{
            return [
                "result" => "ng",
                "error_message" => "メールアドレスまたはパスワードが間違っています",
            ];
        }
    }
}
