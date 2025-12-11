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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            // Người nhận thông báo (user)
            $table->unsignedBigInteger('user_id');

            // // Loại thông báo
            // // new_message | post_published | post_expiring | payment_success (nếu muốn mở rộng)
            $table->string('type');

            // Dữ liệu linh hoạt dạng JSON:
            // ví dụ: {"post_id": 12, "title": "Cho thuê nhà", "sender_id": 5}
            $table->json('data');

            // Đã đọc chưa
            $table->boolean('is_read')->default(false);

            $table->timestamps();

            // Liên kết khóa ngoại
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
