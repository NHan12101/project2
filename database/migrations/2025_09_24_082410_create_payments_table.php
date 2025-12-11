<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('cascade');

            $table->string('method'); // stripe, paypal, momo, vnpay
            $table->string('status')->default('pending'); // pending | success | failed
            $table->string('currency')->default('USD');
            $table->decimal('amount', 15, 2);

            $table->string('transaction_id')->nullable(); 
            $table->string('order_id')->nullable(); // dùng cho MoMo / VNPAY
            $table->text('payment_url')->nullable();
            $table->json('metadata')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
