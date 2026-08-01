<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Linisin muna ang lumang tokens para walang maiwang conflict
        DB::table('personal_access_tokens')->delete();

        // 2. Baguhin ang tokenable_id mula bigint patungong UUID
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropColumn('tokenable_id');
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->uuid('tokenable_id');
            $table->index(['tokenable_type', 'tokenable_id']);
        });
    }

    public function down(): void
    {
        // Baliktad kung sakaling i-rollback
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropColumn('tokenable_id');
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->bigInteger('tokenable_id');
            $table->index(['tokenable_type', 'tokenable_id']);
        });
    }
};
