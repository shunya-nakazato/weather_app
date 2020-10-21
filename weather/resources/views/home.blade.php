@extends('layouts.app')

@section('content')

@include('home.create_style')
<style>
    .form-contorl {
        width: 200px;
    }
</style>
<div class="container">
    @if ($errors->any())
        <div style="text-align: center; color: red">エラーです</div>
    @endif
    <form id="create" action="{{ route('weather_image_create') }}" method='POST' enctype="multipart/form-data">
        @csrf
        <div>
            <input type="file" name="weather_image" id="input-file" accept="image/*">
            <div id="preview_field"></div>
            <p id="image_clear_button">削除</p>
        </div>
        <label for="info">天気の状態（英語）</label>
        <input type="text" class="form-control" id="info" name="info">
        <br>
        <label for="name">天気の状態</label>
        <input type="text" class="form-control" id="name" name="name">
        <br>
        <label for="name">はじめID</label>
        <input type="text" class="form-control" id="start-id" name="start_id">
        <br>
        <label for="name">おわりID</label>
        <input type="text" class="form-control" id="end-id" name="end_id">
        <br>
        <input type="submit" class="form-control" style="width: 98px; margin-right: 10px;" value="作成">
    </form>
    <div id="list">
        @foreach($weather_images as $weather_image)
            <div class="weather-image">
                <img src="{{ $weather_image->image_path }}" class="image">
                <p class="info">{{ $weather_image->info }}</p>
                <p class="info">{{ $weather_image->name }}</p>
                <p class="info">初めのID：{{ $weather_image->start_id }}</p>
                <p class="info">終わりのID：{{ $weather_image->end_id }}</p>
                <button type="button" class="btn btn-secondary" id="{{ $weather_image->id }}" style="height: 30px; line-height: 15px; border-radius: 0.25rem">×</button>
            </div>
        @endforeach
    </div>
</div>
<script>
    @foreach($weather_images as $weather_image)
        $('#{{ $weather_image->id }}').click(function(){
            $id = {{ $weather_image->id }};
            window.location.href = "./weather_image/delete/" + $id;
        })
    @endforeach
</script>
@include('home.create_script')

@endsection
