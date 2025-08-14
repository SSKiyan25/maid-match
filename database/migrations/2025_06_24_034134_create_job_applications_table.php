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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->onDelete('cascade');
            $table->foreignId('maid_id')->constrained()->onDelete('cascade');
            $table->enum('status', [
                'pending',
                'shortlisted',
                'rejected',
                'withdrawn',
                'hired'
            ])->default('pending');
            $table->integer('ranking_position')->nullable(); // Employer's ranking of this application
            $table->text('employer_notes')->nullable(); // Employer's private notes
            $table->text('description')->nullable(); // Maid's application message
            $table->decimal('proposed_salary', 10, 2)->nullable(); // Maid's salary expectation
            $table->timestamp('applied_at')->useCurrent(); // When application was submitted
            $table->timestamp('hired_at')->nullable(); // When maid was hired
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->unique(['job_posting_id', 'maid_id']); // Prevent duplicate applications
            $table->index(['job_posting_id']);
            $table->index(['maid_id']);
            $table->index(['status', 'applied_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
