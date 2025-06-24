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
            $table->foreignId('job_id')->constrained()->onDelete('cascade');
            $table->foreignId('maid_id')->constrained()->onDelete('cascade');
            $table->string('title'); // "Initial Interview", "Final Interview", "Meet & Greet"
            $table->date('interview_date');
            $table->time('time_start');
            $table->time('time_end');
            $table->enum('status', ['scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'no_show'])->default('scheduled');
            $table->text('description')->nullable();
            $table->enum('type', ['video_call', 'phone_call', 'in_person', 'home_visit'])->default('video_call');
            $table->string('location')->nullable(); // For in-person interviews
            $table->string('meeting_link')->nullable(); // For video calls
            $table->text('employer_notes')->nullable(); // Post-interview notes
            $table->text('maid_notes')->nullable(); // Maid's notes about the interview
            $table->integer('employer_rating')->nullable(); // 1-5 rating from employer
            $table->integer('maid_rating')->nullable(); // 1-5 rating from maid
            $table->timestamp('confirmed_at')->nullable(); // When both parties confirmed
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['job_id']);
            $table->index(['maid_id']);
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