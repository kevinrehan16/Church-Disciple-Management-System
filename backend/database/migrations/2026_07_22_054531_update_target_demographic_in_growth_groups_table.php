<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tanggalin muna ang check constraint kung meron man para makagalaw ang data
        DB::statement('ALTER TABLE growth_groups DROP CONSTRAINT IF EXISTS growth_groups_target_demographic_check;');

        // 2. I-update ang mga lumang values na wala sa bagong listahan (halimbawa, 'single_professionals' -> 'singles')
        DB::table('growth_groups')
            ->where('target_demographic', 'single_professionals')
            ->update(['target_demographic' => 'singles']);

        // 3. Siguraduhing string type muna ang column
        Schema::table('growth_groups', function (Blueprint $table) {
            $table->string('target_demographic')->default('all')->change();
        });

        // 4. I-apply ang bagong CHECK constraint kasama na ang mga bagong options
        DB::statement("ALTER TABLE growth_groups ADD CONSTRAINT growth_groups_target_demographic_check CHECK (target_demographic IN ('all', 'men', 'women', 'youth', 'nextgen', 'growkids', 'couples', 'singles', 'professionals'));");
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE growth_groups DROP CONSTRAINT IF EXISTS growth_groups_target_demographic_check;');
    }
};
