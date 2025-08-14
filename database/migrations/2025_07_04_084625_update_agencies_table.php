<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            // Make license_number nullable
            $table->string('license_number')->nullable()->change();

            // Rename license_photo to license_photo_front
            $table->renameColumn('license_photo', 'license_photo_front');

            // Add new columns
            $table->string('license_photo_back')->nullable()->after('license_photo_front');
            $table->json('address')->nullable()->after('contact_person');
        });
    }

    public function down(): void
    {
        // First update any NULL license_number values to a temporary value
        DB::table('agencies')
            ->whereNull('license_number')
            ->update(['license_number' => 'TEMP-' . uniqid()]);

        Schema::table('agencies', function (Blueprint $table) {
            // Change license_number back to not nullable
            $table->string('license_number')->nullable(false)->change();

            // Drop added columns
            $table->dropColumn(['license_photo_back', 'address']);
        });

        // Do the rename in a separate step to avoid conflicts
        Schema::table('agencies', function (Blueprint $table) {
            // Rename license_photo_front back to license_photo
            $table->renameColumn('license_photo_front', 'license_photo');
        });
    }
};
