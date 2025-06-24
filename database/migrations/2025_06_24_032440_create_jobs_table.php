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
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->json('work_types')->nullable(); // cleaning, cooking, childcare, eldercare, etc.
            $table->boolean('provides_toiletries')->default(false);
            $table->boolean('provides_food')->default(false);
            $table->enum('accommodation_type', ['live_in', 'live_out', 'flexible'])->nullable();
            $table->decimal('min_salary', 10, 2)->nullable();
            $table->decimal('max_salary', 10, 2)->nullable();
            $table->string('day_off_preference')->nullable(); // "Sunday", "Flexible", "2 days per week"
            $table->enum('day_off_type', ['weekly', 'monthly', 'flexible', 'none'])->default('weekly');
            $table->json('language_preferences')->nullable(); // ["English", "Tagalog", "Cebuano"]
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive', 'filled', 'expired', 'draft'])->default('active');
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['employer_id']);
            $table->index(['status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};