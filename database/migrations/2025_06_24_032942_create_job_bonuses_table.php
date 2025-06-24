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
        Schema::create('job_bonuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_id')->constrained()->onDelete('cascade');
            $table->string('title'); // "13th Month Pay", "Holiday Bonus", "Performance Bonus"
            $table->decimal('amount', 10, 2)->nullable(); // Can be null for non-monetary bonuses
            $table->enum('status', ['active', 'inactive', 'conditional'])->default('active');
            $table->text('description')->nullable(); // Details about the bonus
            $table->enum('type', ['monetary', 'benefit', 'allowance'])->default('monetary');
            $table->enum('frequency', ['one_time', 'monthly', 'quarterly', 'yearly', 'performance_based'])->nullable();
            $table->text('conditions')->nullable(); // Requirements to get this bonus
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['job_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_bonuses');
    }
};