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
        Schema::create('agency_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->integer('amount'); // Positive for add, negative for usage
            $table->string('type'); // e.g. 'purchase', 'used', 'refund', 'admin_grant'
            $table->string('description')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('agency_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_credits');
    }
};
