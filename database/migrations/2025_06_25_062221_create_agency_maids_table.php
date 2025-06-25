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
        Schema::create('agency_maids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->foreignId('maid_id')->constrained('maids')->onDelete('cascade');
            $table->enum('status', ['active', 'inactive', 'hired', 'not_available'])->default('active');
            $table->boolean('is_premium')->default(false); // Agency's premium flag
            $table->boolean('is_trained')->default(false); // Agency's trained flag
            $table->text('agency_notes')->nullable(); // Internal notes about this maid
            $table->decimal('agency_fee', 10, 2)->nullable(); // Custom fee for this maid
            $table->timestamp('assigned_at')->useCurrent(); // When maid was assigned to agency
            $table->timestamp('status_changed_at')->nullable(); // Last status change
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            // Prevent duplicate maid assignments
            $table->unique(['agency_id', 'maid_id']);

            // Indexes for common queries
            $table->index(['agency_id', 'status']);
            $table->index(['maid_id', 'is_archived']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_maids');
    }
};
