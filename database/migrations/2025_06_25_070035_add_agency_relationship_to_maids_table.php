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
        Schema::table('maids', function (Blueprint $table) {
            $table->foreignId('agency_id')->nullable()->constrained('agencies')->onDelete('set null');
            // Track how maid was registered
            $table->enum('registration_type', ['individual', 'agency', 'none'])->default('none');

            // When maid was assigned to agency
            $table->timestamp('agency_assigned_at')->nullable();

            // Index for performance
            $table->index(['agency_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maids', function (Blueprint $table) {
            $table->dropForeign(['agency_id']);
            $table->dropIndex(['agency_id', 'status']);
            $table->dropColumn(['agency_id', 'registration_type', 'agency_assigned_at']);
        });
    }
};
