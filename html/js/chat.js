$(function(){
    // Firebaseの設定
    var firebaseConfig = {
        apiKey: "AIzaSyAQsQTMdaU2GJJLDcRjlICUQS-I_35n4qw",
        authDomain: "weather-7db47.firebaseapp.com",
        databaseURL: "https://weather-7db47.firebaseio.com",
        projectId: "weather-7db47",
        storageBucket: "weather-7db47.appspot.com",
        messagingSenderId: "681260520459",
        appId: "1:681260520459:web:100bc8ac8f6aea5208230e"
    };
    // Firebase接続
    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();
    let room = $area_name_encoded;
    const send = document.getElementById("send");
    const message = document.getElementById("message");

    send.addEventListener('click', function() {
        var created_at = Date.now();
        database.ref(room).push({
            message:message.value,
            created_at:created_at
        });
            message.value = "";
            created_at = 0;
    });

    var now_date = Date.now();
    var before_30minutes_date = now_date - 1800000;

    database.ref(room).orderByChild('created_at').startAt(before_30minutes_date).on("child_added", function(data) {
        const v = data.val();
        const k = data.key;
        const d = new Date(v.created_at);
        var year = d.getFullYear();
        var month = d.getMonth()+1;
        var date = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        let now_date = year + "-" +  month + "-" + date + "-" + hour + ":" + min;
        $str = '<div class="text">' + v.message + '<br><small>' + now_date + '</small></div>';

        $('#output').prepend($str);
    });
})