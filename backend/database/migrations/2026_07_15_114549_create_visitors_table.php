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
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            // Basic Info
            $table->string('visitor_id', 20)->unique();
            $table->date('date_visited');
            $table->string('service_time', 12);
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->date('birthday');
            $table->string('age_group', 15);
            $table->string('gender', 8);

            // Address
            $table->string('barangay', 30);
            $table->string('city', 30);
            $table->string('province', 30);

            // Life-Stage
            $table->string('life_stage', 12);
            $table->string('life_stage_other', 12)->nullable();
            $table->string('current_church', 100)->nullable();

            // Contacts
            $table->string('mobile_number', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('facebook_name', 100)->nullable();

            // Referral
            $table->string('heard_from_invitee', 100)->nullable();
            $table->string('heard_from_details', 100)->nullable();

            // Notes
            $table->text('prayer_requests')->nullable();
            $table->text('remarks')->nullable();
            $table->text('welcome_by')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
