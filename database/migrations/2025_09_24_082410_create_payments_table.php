<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // $table->foreignId('post_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->constrained()->cascadeOnDelete();

            $table->integer('days'); // số ngày user chọn (15 / 30 / 60)

            $table->string('method'); // momo, vnpay, stripe
            $table->string('status')->default('pending');
            // pending | success | failed

            $table->string('currency')->default('VND');
            $table->decimal('amount', 15, 2); // tổng tiền

            $table->string('transaction_id')->nullable();
            $table->string('order_id')->nullable();
            $table->text('payment_url')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
