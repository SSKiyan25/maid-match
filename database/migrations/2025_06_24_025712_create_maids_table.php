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
        Schema::create('maids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('bio')->nullable();
            $table->json('skills')->nullable();
            $table->string('nationality')->nullable();
            $table->json('languages')->nullable();
            $table->json('social_media_links')->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->boolean('has_children')->default(false);
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->boolean('is_willing_to_relocate')->default(false);
            $table->string('preferred_accommodation')->nullable();
            $table->date('earliest_start_date')->nullable();
            $table->integer('years_experience')->default(0);
            $table->enum('status', ['available', 'unavailable', 'employed', 'inactive'])->default('available');
            $table->json('availability_schedule')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->json('verification_badges')->nullable(); // ['id_verified', 'background_check', 'skill_certified']
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maids');
    }
};