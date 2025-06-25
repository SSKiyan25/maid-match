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
        Schema::create('agency_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');

            // Fee Display Settings
            $table->boolean('show_fees_publicly')->default(false); // Override agency table setting
            $table->boolean('allow_fee_negotiation')->default(true);

            // Branding Settings
            $table->string('brand_color')->nullable(); // Hex color for agency branding
            $table->text('brand_tagline')->nullable(); // Agency tagline/slogan
            $table->boolean('show_agency_branding_on_maids')->default(true); // Show "Handled by [Agency]"

            // Business Preferences
            $table->json('preferred_work_types')->nullable(); // What types of jobs they focus on
            $table->json('service_areas')->nullable(); // Cities/provinces they serve
            $table->boolean('accept_direct_inquiries')->default(true); // Allow employers to contact directly

            // Notification Preferences
            $table->boolean('notify_new_job_postings')->default(true);
            $table->boolean('notify_maid_applications')->default(true);
            $table->boolean('notify_employer_inquiries')->default(true);

            // Training & Certification
            $table->text('training_programs')->nullable(); // What training they provide
            $table->text('certifications')->nullable(); // Agency certifications
            $table->boolean('highlight_training')->default(false); // Emphasize training in profiles

            // Replacement Policy
            $table->integer('replacement_guarantee_days')->nullable(); // Days for free replacement
            $table->text('replacement_policy')->nullable(); // Replacement policy details

            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            // Ensure one settings record per agency
            $table->unique('agency_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agency_settings');
    }
};
