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
        Schema::create('employers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('household_description')->nullable();
            $table->integer('family_size');
            $table->boolean('has_pets')->default(false);
            $table->boolean('has_children')->default(false);
            $table->enum('status', ['active', 'inactive', 'looking', 'fulfilled'])->default('active');
            $table->json('maid_preferences')->nullable();
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
        Schema::dropIfExists('employers');
    }
};
