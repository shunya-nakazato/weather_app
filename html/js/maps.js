$(function(){
    // 天気を表す画像を一括取得
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

        //再読み込みされた際の緯度経度の情報
        if (sessionStorage.getItem('lat')) {
            var lat = Number(sessionStorage.getItem('lat'));
            var lng = Number(sessionStorage.getItem('lng'));
            var zoom = Number(sessionStorage.getItem('zoom'));
        } else { //記憶された緯度経度がない
            var lat = 35.6809591;
            var lng = 139.7673068;
            var zoom = 10;
            sessionStorage.setItem('lat', lat);
            sessionStorage.setItem('lng', lng);
            sessionStorage.setItem('zoom', zoom);
        }
        
        // マップの表示
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: lat,
                lng: lng
            },
            zoom: zoom,
            disableDefaultUI: true,
            clickableIcons: false
        });

        //ズームされるたびにズームの倍率を保存
        google.maps.event.addListener(map, 'zoom_changed', function() {
            var zoom = map.getZoom();
            sessionStorage.setItem('zoom', zoom);
        });
        
        // 市町村の名前を取得するAPI
        var area_name_api = {
            "async": true,
            "crossDomain": true,
            "url": "https://geoapi.heartrails.com/api/json?method=searchByGeoLocation&y=" + lat + "&x=" + lng,
            "method": "GET",
        }
        // 天気を取得するAPI
        var weather_api = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&APPID=7ffb4de22f4a115872ffb0b3df9e8bd5",
            "method": "GET",
        }
        $.ajax(area_name_api).done(function(data){
            $('.area-name').text(data.response.location[0].city)
            
            $.ajax(weather_api).done(function (data) {
                $weather_status = data.weather[0]['id']; // 天気の状態
                    $temp = String(Math.round(data.main.temp - 273.15)); // 気温
                    $('#temp').text($temp + "℃");
                    // 天気の画像
                    for($i=0; $i < weather_images.length; $i++){
                        // console.log(Number(weather_images[$i]['start_id']), Number(weather_images[$i]['end_id']));
                        if(Number(weather_images[$i]['start_id']) <= $weather_status && $weather_status <= Number(weather_images[$i]['end_id'])){
                            $('#weather').text(weather_images[$i]['name']);
                            $('#weather-image').attr('src', 'https://weather-app-sample.com/admin/' + weather_images[$i]["image_path"]);
                        }
                    }
            });
        });
        
        // マップをクリック/押した時
        map.addListener('click', function(e){
            var lat = e.latLng.lat();
            var lng = e.latLng.lng();
            this.panTo(e.latLng);
            console.log(zoom);

            sessionStorage.setItem('lat', lat);
            sessionStorage.setItem('lng', lng);

            var area_name_api = {
                "async": true,
                "crossDomain": true,
                "url": "https://geoapi.heartrails.com/api/json?method=searchByGeoLocation&y=" + lat + "&x=" + lng,
                "method": "GET",
            }
            var weather_api = {
                "async": true,
                "crossDomain": true,
                "url": "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&APPID=7ffb4de22f4a115872ffb0b3df9e8bd5",
                "method": "GET",
            }
            $.ajax(area_name_api).done(function(data){
                $('.area-name').text(data.response.location[0].city)

                $.ajax(weather_api).done(function (data) {
                    $weather_status = data.weather[0]['id'];
                    $temp = String(Math.round(data.main.temp - 273.15));
                    $('#temp').text($temp + "℃");

                    for($i=0; $i < weather_images.length; $i++){
                        // console.log(Number(weather_images[$i]['start_id']), Number(weather_images[$i]['end_id']));
                        if(Number(weather_images[$i]['start_id']) <= $weather_status && $weather_status <= Number(weather_images[$i]['end_id'])){
                            $('#weather').text(weather_images[$i]['name']);
                            $('#weather-image').attr('src', 'https://weather-app-sample.com/admin/' + weather_images[$i]["image_path"]);
                        }
                    }
                });
            });
        })
        
        // 検索フォームで場所を検索した時
        var geocoder = new google.maps.Geocoder();
        $('#search').click(function(e){
            geocoder.geocode({
                address: $('#address').val()
            }, function(results, status){
                if(status !== 'OK'){
                    alert('失敗');
                    return;
                } 
                if(results[0]){
                    var lat = results[0].geometry.location.lat();
                    var lng = results[0].geometry.location.lng();
                    map.panTo(results[0].geometry.location);

                    sessionStorage.setItem('lat', lat);
                    sessionStorage.setItem('lng', lng);

                    var area_name_api = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://geoapi.heartrails.com/api/json?method=searchByGeoLocation&y=" + lat + "&x=" + lng,
                        "method": "GET",
                    }
                    var weather_api = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&APPID=7ffb4de22f4a115872ffb0b3df9e8bd5",
                        "method": "GET",
                    }
                    $.ajax(area_name_api).done(function(data){
                        $('.area-name').text(data.response.location[0].city)

                        $.ajax(weather_api).done(function (data) {
                            $weather_status = data.weather[0]['id'];
                            $temp = String(Math.round(data.main.temp - 273.15));
                            $('#temp').text($temp + "℃");

                            for($i=0; $i < weather_images.length; $i++){
                                if(Number(weather_images[$i]['start_id']) <= $weather_status && $weather_status <= Number(weather_images[$i]['end_id'])){
                                    $('#weather').text(weather_images[$i]['name']);
                                    $('#weather-image').attr('src', 'https://weather-app-sample.com/admin/' + weather_images[$i]["image_path"]);
                                }
                            }
                        });
                    });
                }else{
                    alert('失敗');
                    return;
                }
            });
        })

        // 現在の位置情報で検索した時
        $('#here-btn').click(function(){
            if(!navigator.geolocation){
                alert('位置情報が許可されていません');
            };
            navigator.geolocation.getCurrentPosition(function(position){
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                map.panTo({lat:lat, lng:lng});

                sessionStorage.setItem('lat', lat);
                sessionStorage.setItem('lng', lng);

                var area_name_api = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://geoapi.heartrails.com/api/json?method=searchByGeoLocation&y=" + lat + "&x=" + lng,
                    "method": "GET",
                }
                var weather_api = {
                    "async": true,
                    "crossDomain": true,
                    "url": "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&APPID=7ffb4de22f4a115872ffb0b3df9e8bd5",
                    "method": "GET",
                }
                $.ajax(area_name_api).done(function(data){
                    $('.area-name').text(data.response.location[0].city)

                    $.ajax(weather_api).done(function (data) {
                        $weather_status = data.weather[0]['id'];
                        $temp = String(Math.round(data.main.temp - 273.15));
                        $('#temp').text($temp + "℃");
    
                        for($i=0; $i < weather_images.length; $i++){
                            // console.log(Number(weather_images[$i]['start_id']), Number(weather_images[$i]['end_id']));
                            if(Number(weather_images[$i]['start_id']) <= $weather_status && $weather_status <= Number(weather_images[$i]['end_id'])){
                                $('#weather').text(weather_images[$i]['name']);
                                $('#weather-image').attr('src', 'https://weather-app-sample.com/admin/' + weather_images[$i]["image_path"]);
                            }
                        }
                    });
                });
            }, function(){
                alert('位置情報が許可されていません');
            });
        })
    }).fail(function(data){
        alert("天気画像取得エラー");
    })
})