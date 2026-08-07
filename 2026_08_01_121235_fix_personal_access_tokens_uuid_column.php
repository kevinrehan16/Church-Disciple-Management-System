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

        // 2. I-drop ang lumang tokenable_id
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropColumn('tokenable_id');
        });

        // 3. Idagdag ulit na ginawang UUID at hinayaang nullable para maiwasan ang not null violation
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->uuid('tokenable_id')->nullable();
            $table->index(['tokenable_type', 'tokenable_id']);
        });
    }

    public function down(): void
    {
        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->dropColumn('tokenable_id');
        });

        Schema::table('personal_access_tokens', function (Blueprint $table) {
            $table->uuid('tokenable_id')->nullable();
            $table->index(['tokenable_type', 'tokenable_id']);
        });
    }
};
