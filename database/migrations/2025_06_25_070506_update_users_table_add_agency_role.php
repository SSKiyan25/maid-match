<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For MySQL - Modify the enum to add 'agency'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('employer', 'maid', 'admin', 'agency') DEFAULT 'employer'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove 'agency' from enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('employer', 'maid', 'admin') DEFAULT 'employer'");
    }
};
