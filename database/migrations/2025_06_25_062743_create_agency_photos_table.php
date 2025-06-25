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
        Schema::create('agency_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->string('url'); // Photo URL/path
            $table->string('caption')->nullable(); // Photo description
            $table->enum('type', ['logo', 'office', 'team', 'certificate', 'other'])->default('other');
            $table->integer('sort_order')->default(0); // Display order
            $table->boolean('is_primary')->default(false); // Main agency photo/logo
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            // Indexes for common queries
            $table->index(['agency_id', 'type']);
            $table->index(['agency_id', 'is_primary']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_photos');
    }
};
