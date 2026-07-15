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
            $table->string('service_time');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birthday');
            $table->string('age_group');
            $table->string('gender');

            // Address
            $table->string('barangay');
            $table->string('city');
            $table->string('province');

            // Life-Stage
            $table->string('life_stage');
            $table->string('life_stage_other')->nullable();
            $table->string('current_church')->nullable();

            // Contacts
            $table->string('mobile_number')->nullable();
            $table->string('email')->nullable();
            $table->string('facebook_name')->nullable();

            // Referral
            $table->string('heard_from_invitee')->nullable();
            $table->string('heard_from_details')->nullable();

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
