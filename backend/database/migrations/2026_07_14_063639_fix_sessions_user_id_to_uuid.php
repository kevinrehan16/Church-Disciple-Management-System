<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. I-drop muna natin ang lumang user_id na naka-bigint
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });

        // 2. I-create natin ulit ito bilang UUID
        Schema::table('sessions', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });

        Schema::table('sessions', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->index();
        });
    }
};
