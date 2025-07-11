<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('license_number')->nullable()->change();
            $table->renameColumn('license_photo', 'license_photo_front');
            // $table->string('license_photo_front')->nullable()->after('license_number');
            $table->string('license_photo_back')->nullable()->after('license_photo_front');
            $table->json('address')->nullable()->after('contact_person');
        });
    }

    public function down(): void
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('license_number')->nullable(false)->change();
            $table->renameColumn('license_photo_front', 'license_photo');
            $table->dropColumn('license_photo_front');
            $table->dropColumn('license_photo_back');
            $table->dropColumn('address');
        });
    }
};
