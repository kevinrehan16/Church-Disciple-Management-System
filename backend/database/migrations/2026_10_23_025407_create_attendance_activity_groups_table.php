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
        Schema::create('attendance_activity_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('attendance_activities')->cascadeOnDelete();
            // Palitan ang 'growth_groups' kung iba ang pangalan ng table ng mga grupo ninyo
            $table->foreignId('group_id')->constrained('growth_groups')->cascadeOnDelete();
            $table->unique(['activity_id', 'group_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_activity_groups');
    }
};
