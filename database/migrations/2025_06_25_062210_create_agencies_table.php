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
            $table->text('description')->nullable(); // About the agency
            $table->string('contact_person'); // Main contact person
            $table->string('phone_number'); // Business phone
            $table->string('business_email')->nullable(); // Business email (can use user email)
            $table->text('address'); // Physical address
            $table->string('city'); // City location
            $table->string('province'); // Province location
            $table->decimal('placement_fee', 10, 2)->nullable(); // Standard placement fee
            $table->boolean('show_fee_publicly')->default(false); // Fee visibility setting
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending_verification'])->default('pending_verification');
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
