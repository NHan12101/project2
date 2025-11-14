<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wards', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            // ← ĐÚNG: Phường/Xã thuộc về Thành phố (cities)
            $table->foreignId('city_id')
                ->constrained('cities')
                ->onDelete('cascade');

            // Tránh trùng tên phường trong cùng 1 thành phố
            $table->unique(['name', 'city_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wards');
    }
};
