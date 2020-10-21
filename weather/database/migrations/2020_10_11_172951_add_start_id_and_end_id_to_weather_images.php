<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStartIdAndEndIdToWeatherImages extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('weather_images', function (Blueprint $table) {
            //
            $table->string('start_id');
            $table->string('end_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('weather_images', function (Blueprint $table) {
            //
            $table->dropColumn('start_id');
            $table->dropColumn('end_id');
        });
    }
}
