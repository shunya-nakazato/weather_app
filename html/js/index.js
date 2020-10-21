$(function(){
    //cookie読み込み
    var id = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var name = document.cookie.replace(/(?:(?:^|.*;\s*)user_name\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var email = document.cookie.replace(/(?:(?:^|.*;\s*)user_email\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    // cookieで条件分岐-ログインボタンorユーザー詳細リンク
    if(id){
        $('#header').append($('<a href="./user_page.html"><img src="./img/face-24px.svg" alt="ロゴ" width="24px" height="24px"></a>'));
    }else{
        $('#header').append($('<a href="./login.html">ログイン</a>'));
    }
    console.log(id, name, email);
    
    //チャットエリアの表示
    $('#chat-btn').click(function(){
        $('#chat-area').slideDown();
        $area_name = $('#area-name').text(); //市町村名の取得
        console.log($area_name);
        $area_name_encoded = encodeURIComponent($area_name); //Firebase用にエンコード
        // console.log($area_name_encoded);

        // Firebase 設定
        var firebaseConfig = {
            apiKey: "AIzaSyAQsQTMdaU2GJJLDcRjlICUQS-I_35n4qw",
            authDomain: "weather-7db47.firebaseapp.com",
            databaseURL: "https://weather-7db47.firebaseio.com",
            projectId: "weather-7db47",
            storageBucket: "weather-7db47.appspot.com",
            messagingSenderId: "681260520459",
            appId: "1:681260520459:web:100bc8ac8f6aea5208230e"
        };
        // Firebase 接続
        firebase.initializeApp(firebaseConfig);

        var database = firebase.database();
        let room = "weather_chat"; //Firebaseのデータベース作成/指定
        const send = document.getElementById("send");
        const message = document.getElementById("message");

        //Firebaseに書き込み
        send.addEventListener('click', function() {
            var created_at = Date.now(); //現在の時間
            database.ref(room).push({
                area_name: $area_name_encoded,
                message: message.value,
                created_at: created_at
            });
                message.value = "";
                created_at = 0;
        });

        var now_date = Date.now();
        var before_30minutes_date = now_date - 1800000; //30分前の時間

        //Firebaseから読み込み
        database.ref(room).orderByChild('area_name').equalTo($area_name_encoded).on("child_added", function(data) {
            const v = data.val();
            const k = data.key;
            const d = new Date(v.created_at);
            //30分以内のメッセージを表示する
            try {
                if (d < before_30minutes_date) {
                    throw new Error('end');
                }
                var year = d.getFullYear();
                var month = d.getMonth()+1;
                var date = d.getDate();
                var hour = d.getHours();
                var min = d.getMinutes();
                let now_date = year + "-" +  month + "-" + date + "-" + hour + ":" + min;
                $str = '<div class="text">' + v.message + '<br><small>' + now_date + '</small></div>';
    
                $('#output').prepend($str);
            } catch(e) {
                console.log(e.message);
            }
        });
    })

    $('#chat-close-btn').click(function(){
        $('#chat-area').slideUp("", function(){
            location.reload(); //毎回Firebaseとの接続をリセットするために再読み込み
        });
    })

    $('#likes-btn').click(function(){
        if (document.cookie) {
            var id = Number(document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
            var lat = Number(sessionStorage.getItem('lat'));
            var lng = Number(sessionStorage.getItem('lng'));
            var param = {
                "id": id,
                "lat": lat,
                "lng": lng,
            };
            $.ajax({
                url: "https://weather-app-sample.com/admin/api/v1/app_user_likes/store",
                type: "post",
                data: JSON.stringify(param),
                contentType: 'application/json',
                dataType: 'json',
                timeout: 60000
            }).done(function(data){
                console.log(data);
                if(data.result == "already"){
                    alert("すでに保存済みです");
                    return;
                } else if (data.result == "ok"){
                    $('#flash-message').text("保存しました");
                    $('#flash-message').slideDown("", function(){
                        setTimeout("$('#flash-message').slideUp()",1000);
                    });
                } else {
                    alert("保存のエラーです");
                };
            }).fail(function(data){
                console.log(data);
                alert("保存のエラーです");
            });
        } else {
            alert("ログインしてください");
        }
    })
})