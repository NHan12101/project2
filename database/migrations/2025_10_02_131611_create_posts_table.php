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

            $table->string('address_detail')->nullable();

            $table->decimal('area', 10, 2);

            $table->integer('bedrooms');

            $table->integer('bathrooms');

            $table->integer('livingrooms');

            $table->integer('kitchens');

            $table->foreignId('subscription_id')->nullable()->constrained('subscriptions');

            $table->enum('status', ['draft', 'pending', 'visible', 'hidden'])->default('draft');

            $table->timestamp('package_expired_at')->nullable();

            $table->enum('type', ['rent', 'sale']);

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->foreignId('city_id')->constrained();

            $table->foreignId('ward_id')->nullable()->constrained();

            // --- Nhóm SEO ---
            $table->string('slug')->unique()->nullable();

            // --- Nhóm vị trí nâng cao ---
            $table->decimal('latitude', 10, 7)->nullable();

            $table->decimal('longitude', 10, 7)->nullable();

            $table->integer('floors')->nullable();

            $table->string('direction')->nullable(); // Đông, Tây, Nam, Bắc

            $table->string('legal')->nullable(); // Sổ hồng, Sổ đỏ...

            $table->string('furniture')->nullable(); // đầy đủ / cơ bản / trống

            $table->string('video')->nullable();

            $table->string('youtube_url')->nullable();

            $table->timestamp('last_activity_at')->nullable()->index();

            $table->timestamps();

            // --- Tạo index để tìm kiếm nhanh ---
            $table->index('title');
            $table->index('price');
            $table->index('area');
            $table->index('city_id');
            $table->index('ward_id');
            $table->index('status');
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
