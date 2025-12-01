<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuggestsTable extends Migration
{
    public function up()
    {
        Schema::create('suggests', function (Blueprint $table) {
            $table->id();
            $table->string('keyword_raw')->index();     // dùng để filter / tìm
            $table->string('phrase_display');           // dùng hiển thị UI (đẹp)
            $table->string('type')->nullable();         // ví dụ: 'district','street','bedroom','price','feature'...
            $table->unsignedInteger('post_count')->default(0);
            $table->unsignedInteger('weight')->default(0); // để ưu tiên
            $table->timestamps();

            $table->unique(['keyword_raw', 'type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('suggests');
    }
}
