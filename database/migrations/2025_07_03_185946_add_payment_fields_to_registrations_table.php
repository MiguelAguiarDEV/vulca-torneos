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
        Schema::table('registrations', function (Blueprint $table) {
            $table->enum('payment_method', ['cash', 'transfer', 'card'])->default('cash');
            $table->enum('payment_status', ['pending', 'confirmed', 'failed'])->default('pending');
            $table->decimal('amount', 8, 2)->default(0);
            $table->text('payment_notes')->nullable();
            $table->timestamp('payment_confirmed_at')->nullable();
            $table->unsignedBigInteger('payment_confirmed_by')->nullable();
            
            $table->foreign('payment_confirmed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            $table->dropForeign(['payment_confirmed_by']);
            $table->dropColumn([
                'payment_method',
                'payment_status',
                'amount',
                'payment_notes',
                'payment_confirmed_at',
                'payment_confirmed_by'
            ]);
        });
    }
};
