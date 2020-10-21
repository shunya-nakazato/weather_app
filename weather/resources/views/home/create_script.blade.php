<script>
    $(function () {
        // 画像
        // クリックで画像を選択する場合
        $('#input-file').on('change', function () {
            // 画像が複数選択されていた場合
            if (this.files.length > 1) {
                alert('画像は1つだけ選択してください');
                $('#input-file').val('');
                return;
            }
            handleFiles(this.files);
        });

        function handleFiles(files) {
            var file = files[0];
            var imageType = 'image.*';

            // ファイルが画像が確認する
            if (! file.type.match(imageType)) {
                alert('画像を選択してください');
                $('#input-file').val('');
                return;
            }

            if(file.size > 2000000){
                alert('ファイルサイズが2MBを越えています' + '(' + file.size + 'バイト' + ')');
                $('#input-file').val('');
                return;
            }

            $('#input-file').hide();  // いちばん上のdrop_areaを非表示にします
            $('#preview_field').show();  // image_clear_buttonを表示させます
            $('#image_clear_button').css("display", "inline");  // image_clear_buttonを表示させます

            var img = document.createElement('img');  // <img>をつくります
            var reader = new FileReader();
            reader.onload = function () {  // 読み込みが完了したら
                img.src = reader.result;  // readAsDataURLの読み込み結果がresult
                $('#preview_field').append(img);  // preview_filedに画像を表示
                img.classList.add("image");//ファイルの大きさをかえるためのクラスを追加
            }
            reader.readAsDataURL(file); // ファイル読み込みを非同期でバックグラウンドで開始
        } 

        // アイコン画像を消去するボタン
        $('#image_clear_button').on('click', function () {
            $('#preview_field').empty();  // 表示していた画像を消去
            $('#input-file').val('');  // inputの中身を消去
            $('#input-file').show();  // drop_areaをいちばん前面に表示
            $('#image_clear_button').hide();  // image_clear_buttonを非表示
            $('#preview_field').hide();  // preview_fieldを非表示
        })

    })
</script>