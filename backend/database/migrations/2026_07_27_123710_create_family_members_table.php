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
        Schema::create('family_members', function (Blueprint $table) {
            $table->id();

            // Link papunta sa families table
            $table->foreignId('family_id')
                ->constrained('families')
                ->onDelete('cascade');

            // Link papunta sa members table (UNIQUE kasi 1 active household lang dapat)
            $table->foreignId('member_id')
                ->unique()
                ->constrained('members')
                ->onDelete('cascade');

            // Role ng miyembro sa pamilyang ito
            $table->enum('role', ['Head', 'Spouse', 'Child', 'Dependent', 'Other'])
                ->default('Child');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('family_members');
    }
};
