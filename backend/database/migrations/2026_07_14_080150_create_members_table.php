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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade'); // Link sa users table

            // Personal Info
            $table->string('member_id', 20)->unique();
            $table->string('nickname', 30)->nullable();
            $table->string('last_name', 50);
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->string('gender', 8);
            $table->date('birthday')->nullable();
            $table->integer('age')->default(0);

            // Family/Misc
            $table->string('spouse_name', 100)->nullable();
            $table->string('father_name', 100)->nullable();
            $table->string('mother_name', 100)->nullable();
            $table->string('facebook_name', 100)->nullable();
            $table->string('lifestage', 20)->nullable();

            // Contact & Address
            $table->string('mobile_number', 20);
            $table->string('contact_details', 100)->nullable();
            $table->string('home_address', 150)->nullable();
            $table->string('country', 30)->nullable();
            $table->string('region', 30)->nullable();
            $table->string('city', 30)->nullable();
            $table->string('barangay', 30)->nullable();

            // Professional
            $table->string('occupation', 50)->nullable();
            $table->string('industry', 50)->nullable();
            $table->string('college_school', 150)->nullable();
            $table->string('college_degree', 100)->nullable();
            $table->string('high_school', 150)->nullable();

            // Religious/Membership
            $table->date('received_jesus')->nullable();
            $table->string('baptized_immersion', 3)->default('No');
            $table->date('baptized_date')->nullable();
            $table->text('spiritual_gift')->nullable();
            $table->string('picture', 60)->nullable();
            $table->string('purpose_reg', 200)->nullable();
            $table->string('prev_church', 100)->nullable();
            $table->string('church_affiliation', 60)->nullable();
            $table->string('satellite_id', 30)->nullable();
            $table->string('member_position', 30)->nullable();
            $table->string('member_status', 20)->default('Active');
            $table->date('membership_date')->nullable();
            $table->boolean('rec_for_baptism')->default(false); // Ginawang boolean
            $table->boolean('rec_for_membership')->default(false); // Ginawang boolean
            $table->text('comment')->nullable();

            // Audit (Sino ang nag-add/update)
            $table->string('user_added', 60)->nullable();
            $table->string('user_updated', 60)->nullable();
            $table->timestamps(); // Ito na yung dateadded/dateupdated mo (Laravel default)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
