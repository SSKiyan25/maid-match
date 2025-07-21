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
        Schema::create('job_interview_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->constrained()->onDelete('cascade');
            $table->foreignId('maid_id')->constrained()->onDelete('cascade');
            $table->foreignId('job_application_id')->constrained('job_applications')->onDelete('cascade');
            $table->string('title');
            $table->date('interview_date');
            $table->time('time_start');
            $table->time('time_end');
            $table->enum('status', ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'absent'])->default('scheduled');
            $table->text('description')->nullable();
            $table->enum('type', ['video_call', 'phone_call', 'in_person', 'home_visit'])->default('video_call');
            $table->string('location')->nullable();
            $table->string('meeting_link')->nullable();
            $table->text('employer_notes')->nullable();
            $table->text('maid_notes')->nullable();
            $table->integer('employer_rating')->nullable();
            $table->integer('maid_rating')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['job_posting_id']);
            $table->index(['maid_id']);
            $table->index(['job_application_id']);
            $table->index(['status']);
            $table->index(['interview_date', 'status']);
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_interview_schedules');
    }
};
