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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number')->nullable();
            $table->boolean('is_phone_private')->default(false);
            $table->text('address')->nullable();
            $table->boolean('is_address_private')->default(false);
            $table->boolean('is_archived')->default(false);
            $table->json('preferred_contact_methods')->nullable(); // ['phone', 'email', 'app_notification']
            $table->string('preferred_language')->default('en');
            $table->timestamps();

            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};