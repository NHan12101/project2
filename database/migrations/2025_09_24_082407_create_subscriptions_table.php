<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();

            $table->string('name'); // Tin thường, VIP bạc...
            $table->integer('price_per_day'); // giá / ngày
            $table->string('currency')->default('VND');

            $table->unsignedTinyInteger('priority')->default(1);
            // priority càng cao => hiển thị càng trên

            $table->boolean('active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
