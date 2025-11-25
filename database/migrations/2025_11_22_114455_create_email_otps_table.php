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
        Schema::create('email_otps', function (Blueprint $table) {
            $table->id();

            // Liên kết với users (nullable vì có người chưa tạo user mà vẫn gửi OTP)
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            // Email để gửi OTP
            $table->string('email');

            // Mã OTP đã hash
            $table->string('otp');

            // Thời gian hết hạn
            $table->timestamp('expires_at');

            // Số lần nhập sai OTP
            $table->integer('attempts')->default(0);

            $table->string('type'); // register, forgot_password

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_otps');
    }
};
