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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->unsignedBigInteger('price');
            $table->string('address');
            $table->decimal('area', 10, 2);
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->integer('livingrooms');
            $table->integer('kitchens');
            $table->boolean('is_vip')->default(false);
            $table->enum('status', ['hidden', 'visible'])->default('visible');
            $table->enum('type', ['rent', 'sale']);
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade'); // Thay đổi cascade thành set null
            $table->foreignId('city_id')->constrained();
            $table->foreignId('ward_id')->nullable()->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
