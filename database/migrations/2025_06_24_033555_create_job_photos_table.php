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
        Schema::create('job_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->onDelete('cascade');
            $table->string('url');
            $table->string('caption')->nullable();
            $table->enum('type', ['household', 'room', 'kitchen', 'workspace', 'other'])->default('household');
            $table->integer('sort_order')->default(0); // For ordering photos
            $table->boolean('is_primary')->default(false); // Main/featured photo
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['job_posting_id']);
            $table->index(['job_posting_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_photos');
    }
};