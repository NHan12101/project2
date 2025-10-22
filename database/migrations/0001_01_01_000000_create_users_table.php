<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('password')->nullable(); // để login bằng Google
            $table->string('phone')->nullable();
            $table->string('avatar_image_url')->nullable();
            $table->boolean('notification')->default(1);
            $table->enum('role', ['user', 'admin'])->default('user');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            // 👇 Thêm 2 trường cho đăng nhập bằng Google
            $table->string('google_id')->nullable()->unique();
            $table->string('avatar')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
