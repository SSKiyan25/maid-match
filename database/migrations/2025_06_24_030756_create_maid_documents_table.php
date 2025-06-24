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
        Schema::create('maid_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('maid_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['id', 'passport', 'certificate', 'resume', 'reference', 'medical', 'other'])->default('other');
            $table->string('title');
            $table->string('url');
            $table->text('description')->nullable();
            $table->boolean('is_archived')->default(false);
            $table->timestamps();

            $table->index(['maid_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maid_documents');
    }
};