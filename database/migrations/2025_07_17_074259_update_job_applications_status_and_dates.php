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
        Schema::table('job_applications', function (Blueprint $table) {
            // Change status enum: remove 'reviewed', 'accepted', add 'hired'
            $table->enum('status', [
                'pending',
                'shortlisted',
                'rejected',
                'withdrawn',
                'hired'
            ])->default('pending')->change();

            // Remove reviewed_at column
            if (Schema::hasColumn('job_applications', 'reviewed_at')) {
                $table->dropColumn('reviewed_at');
            }

            // Add hired_at column
            $table->timestamp('hired_at')->nullable()->after('applied_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            // Restore previous status enum
            $table->enum('status', [
                'pending',
                'reviewed',
                'shortlisted',
                'rejected',
                'accepted',
                'withdrawn'
            ])->default('pending')->change();

            // Restore reviewed_at column
            $table->timestamp('reviewed_at')->nullable()->after('applied_at');

            // Remove hired_at column
            if (Schema::hasColumn('job_applications', 'hired_at')) {
                $table->dropColumn('hired_at');
            }
        });
    }
};
