<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_spiritual_gifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->foreignId('spiritual_gift_id')->constrained('spiritual_gifts')->onDelete('cascade');

            // Helpful metadata for ministry placement:
            $table->enum('level', ['primary', 'secondary', 'developing'])->default('primary');
            $table->unsignedSmallInteger('score')->nullable();     // Optional score if using a test/quiz (e.g., 1-100)
            $table->text('notes')->nullable();                      // Leader notes or observations

            $table->timestamps();

            // Prevents assigning the exact same gift to a member twice
            $table->unique(['member_id', 'spiritual_gift_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_spiritual_gifts');
    }
};
