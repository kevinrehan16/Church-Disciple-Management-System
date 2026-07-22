<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('spiritual_gifts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();                  // e.g., "Leadership", "Teaching", "Mercy"
            $table->string('code', 50)->nullable()->unique();        // e.g., "GIFT-LEADERSHIP"
            $table->string('category', 50)->nullable();             // e.g., "Serving", "Speaking", "Leadership"
            $table->text('description')->nullable();                // Brief explanation of the gift
            $table->text('scripture_references')->nullable();       // e.g., "Romans 12:6-8, 1 Corinthians 12:8-10"
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('spiritual_gifts');
    }
};
