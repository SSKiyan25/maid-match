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
        Schema::create('user_reports', function (Blueprint $table) {
            $table->id();

            // Who reported and who was reported
            $table->foreignId('reporter_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('reported_user_id')->constrained('users')->onDelete('cascade');

            // Report details
            $table->string('report_type'); // e.g., 'harassment', 'spam', 'inappropriate', 'fraud'
            $table->text('description'); // Detailed explanation of the issue
            $table->string('evidence_photo')->nullable(); // Optional photo evidence

            // Status tracking
            $table->enum('status', ['pending', 'under_review', 'resolved', 'dismissed'])->default('pending');
            $table->text('admin_notes')->nullable(); // For internal use
            $table->foreignId('handled_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();

            // Standard timestamps
            $table->timestamps();

            $table->index('reporter_id');
            $table->index('reported_user_id');
            $table->index('handled_by');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_reports');
    }
};
