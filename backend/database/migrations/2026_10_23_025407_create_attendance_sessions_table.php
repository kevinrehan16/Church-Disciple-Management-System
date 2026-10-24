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
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('attendance_activities')->cascadeOnDelete();
            $table->foreignId('group_id')->nullable()->constrained('growth_groups')->nullOnDelete();
            $table->string('title'); // Halimbawa: Sunday Worship - Jan 15, 2026
            $table->dateTime('starts_at');
            $table->dateTime('ends_at')->nullable();
            $table->string('status')->default('draft'); // draft, open, finalized, cancelled
            $table->unsignedInteger('version')->default(1); // Para sa concurrency control
            $table->foreignUuid('created_by')->constrained('users');
            $table->foreignUuid('finalized_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('finalized_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};
