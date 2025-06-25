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
        Schema::create('job_location', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->onDelete('cascade');
            $table->string('brgy');
            $table->string('city');
            $table->string('landmark')->nullable();
            $table->boolean('is_hidden')->default(false); // Hide exact location for privacy
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable(); // ZIP code
            $table->decimal('latitude', 10, 8)->nullable(); // For map integration
            $table->decimal('longitude', 11, 8)->nullable();
            $table->text('directions')->nullable(); // Additional directions/instructions
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['job_posting_id']);
            $table->index(['city', 'brgy']); // For location-based searches
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_location');
    }
};