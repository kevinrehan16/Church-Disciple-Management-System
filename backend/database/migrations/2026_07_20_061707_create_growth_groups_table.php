<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('growth_groups', function (Blueprint $table) {
            $table->id();

            $table->foreignId('church_id')->constrained('churches')->cascadeOnDelete();
            $table->string('name', 60); // Halimbawa: "Youth GG - North", "Couples GG"
            $table->string('code', 10)->nullable()->unique(); // Halimbawa: "GG-YTH-01"

            // Foreign Keys (Referentials)
            // Kung may Cluster table ka na, i-link dito:
            $table->foreignId('cluster_id')->nullable()->constrained('clusters')->nullOnDelete();
            // Ang Leader ng GG ay galing din sa Members table
            $table->foreignId('leader_id')->nullable()->constrained('members')->nullOnDelete();

            // Schedule & Venue Details
            $table->string('meeting_day', 12)->nullable(); // Halimbawa: "Friday", "Saturday"
            $table->time('meeting_time')->nullable(); // Halimbawa: "19:00:00"
            $table->enum('location_type', ['onsite', 'online', 'hybrid'])->default('onsite');
            $table->text('venue_address')->nullable(); // Halimbawa: "Church Rm 201" o Zoom link

            // Target Demographic / Group Category
            $table->enum('target_demographic', [
                'all',
                'men',
                'women',
                'youth',
                'nextgen',
                'growkids',
                'couples',
                'singles',
                'professionals'
            ])->default('all');

            // Status
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes(); // Para sa safe deletion
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('growth_groups');
    }
};
