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
        Schema::table('agency_inquiries', function (Blueprint $table) {
            // Foreign Keys
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->foreignId('employer_id')->constrained('employers')->onDelete('cascade');
            $table->foreignId('job_posting_id')->nullable()->constrained('job_postings')->onDelete('set null');
            $table->foreignId('maid_id')->nullable()->constrained('maids')->onDelete('set null');

            // Inquiry Details
            $table->enum('type', ['general', 'specific_maid', 'specific_job', 'pricing', 'replacement'])->default('general');
            $table->string('subject');
            $table->text('message');
            $table->text('agency_response')->nullable();

            // Status & Tracking
            $table->enum('status', ['pending', 'responded', 'closed', 'archived'])->default('pending');
            $table->decimal('quoted_fee', 10, 2)->nullable();
            $table->text('pricing_details')->nullable();

            // Communication
            $table->string('employer_contact_preference')->nullable();
            $table->boolean('urgent')->default(false);
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('closed_at')->nullable();

            $table->boolean('is_archived')->default(false);

            // Indexes for performance
            $table->index(['agency_id', 'status']);
            $table->index(['employer_id', 'created_at']);
            $table->index(['job_posting_id']);
            $table->index(['maid_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agency_inquiries', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropForeign(['agency_id']);
            $table->dropForeign(['employer_id']);
            $table->dropForeign(['job_posting_id']);
            $table->dropForeign(['maid_id']);

            // Drop indexes
            $table->dropIndex(['agency_id', 'status']);
            $table->dropIndex(['employer_id', 'created_at']);
            $table->dropIndex(['job_posting_id']);
            $table->dropIndex(['maid_id']);

            // Drop columns
            $table->dropColumn([
                'agency_id',
                'employer_id',
                'job_posting_id',
                'maid_id',
                'type',
                'subject',
                'message',
                'agency_response',
                'status',
                'quoted_fee',
                'pricing_details',
                'employer_contact_preference',
                'urgent',
                'responded_at',
                'closed_at',
                'is_archived'
            ]);
        });
    }
};
