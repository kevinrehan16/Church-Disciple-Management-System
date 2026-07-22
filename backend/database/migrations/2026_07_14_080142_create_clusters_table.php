<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clusters', function (Blueprint $table) {
            $table->id();

            // Naka-link sa Church
            $table->foreignId('church_id')->constrained('churches')->cascadeOnDelete();

            $table->string('name', 100); // e.g. "North Cluster", "Men's Ministry Cluster"
            $table->string('code', 10)->nullable()->unique();

            // Ang Cluster Head / Overseer ay galing din sa Members
            $table->unsignedBigInteger('member_id')->nullable();

            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clusters');
    }
};
