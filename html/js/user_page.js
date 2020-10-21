$(function(){
    var weather_images;
    $.ajax({
        url: "https://weather-app-sample.com/admin/api/v1/weather",
        type: "get",
        timeout: 60000,
    }).done(function(data){
        if(data.result != "ok"){
            alert("天気画像取得エラー");
            return;
        };
        weather_images = data.weather_images;
        console.log(weather_images);

        var id = Number(document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        $.ajax({
            url: "https://weather-app-sample.com/admin/api/v1/app_user_likes/" + id,
            type: "get",
            timeout: 60000,
        }).done(function(data){
            if (data.result == "ok") {
                $.each(data.likes, function(index, like){
                    var area_name_api = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://geoapi.heartrails.com/api/json?method=searchByGeoLocation&y=" + like.lat + "&x=" + like.lng,
                        "method": "GET",
                    }
                    var weather_api = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://api.openweathermap.org/data/2.5/weather?lat=" + like.lat + "&lon=" + like.lng + "&APPID=7ffb4de22f4a115872ffb0b3df9e8bd5",
                        "method": "GET",
                    }
                    $.ajax(area_name_api).done(function(data){
                        // テンプレートをクローンして、天気の情報を表示
                        $('#main').append($('#copy').clone().attr('id', like.id).css('display', 'inline-block'));
                        $('#' + like.id + ' .area-name').text(data.response.location[0].city);

                        $.ajax(weather_api).done(function (data) {
                            $weather_status = data.weather[0]['id']; // 天気の状態
                                $temp = String(Math.round(data.main.temp - 273.15));
                                $('#' + like.id + ' .temp').text($temp + "℃"); // 気温
                                // 天気の画像
                                for($i=0; $i < weather_images.length; $i++){
                                    console.log(Number(weather_images[$i]['start_id']), Number(weather_images[$i]['end_id']));
                                    if(Number(weather_images[$i]['start_id']) <= $weather_status && $weather_status <= Number(weather_images[$i]['end_id'])){
                                        $('#' + like.id + ' .weather').text(weather_images[$i]['name']);
                                        $('#' + like.id + ' .weather-image').attr('src', 'https://weather-app-sample.com/admin/' + weather_images[$i]["image_path"]);
                                    }
                                }
                        });
                        $('#' + like.id + ' .delete-btn').attr('onClick', 'delete_like(' + like.id+ ')'); //削除ボタンにonClick属性を追加
                    });
                });
            } else {
                $('#main').append('<div>保存なし</div>');
            }
        }).fail(function(data){
            alert('マイページのエラー');
        });
    }).fail(function(data){
        alert("天気画像取得エラー");
    })
    
    // ログアウト
    $('#logout').click(function(){
        document.cookie = "user_id=; max-age=0";
        document.cookie = "user_name=; max-age=0";
        document.cookie = "user_email=; max-age=0";
        window.location.href = "./index.html";
    })
})