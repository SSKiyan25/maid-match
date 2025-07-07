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
        Schema::create('agencies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Links to users table
            $table->string('name'); // Agency business name
            $table->string('license_number')->unique(); // Government license/permit
            $table->string('license_photo')->nullable(); // Path to uploaded license photo
            $table->text('description')->nullable(); // About the agency
            $table->timestamp('established_at')->nullable(); // When the agency was established
            $table->string('business_email')->nullable(); // Business email (can use user email)
            $table->string('business_phone')->nullable(); // Business phone number (can use user phone)
            $table->json('contact_person')->nullable(); // Contact person details (name, phone, email, facebook link)
            $table->string('website')->nullable(); // Agency website URL
            $table->string('facebook_page')->nullable(); // Facebook page URL
            $table->decimal('placement_fee', 10, 2)->nullable(); // Standard placement fee
            $table->boolean('show_fee_publicly')->default(false); // Fee visibility setting
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending_verification'])->default('pending_verification');
            $table->boolean('is_premium')->default(false); // Premium agency flag
            $table->timestamp('premium_at')->nullable(); // When agency became premium
            $table->timestamp('premium_expires_at')->nullable(); // Premium expiration date
            $table->boolean('is_verified')->default(false); // License verification status
            $table->timestamp('verified_at')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agencies');
    }
};
