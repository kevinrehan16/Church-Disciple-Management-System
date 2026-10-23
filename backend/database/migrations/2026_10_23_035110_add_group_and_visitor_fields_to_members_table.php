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
        Schema::table('members', function (Blueprint $table) {
            // 1. Idagdag ang church_group_id kung wala pa
            if (!Schema::hasColumn('members', 'church_group_id')) {
                $table->foreignId('church_group_id')->nullable()->constrained('church_groups')->nullOnDelete()->after('email');
            }

            // 2. Idagdag ang is_visitor kung wala pa
            if (!Schema::hasColumn('members', 'is_visitor')) {
                $table->boolean('is_visitor')->default(false)->after('church_group_id');
            }

            // 3. Ligtas na pagdagdag o pag-update sa phone column
            if (!Schema::hasColumn('members', 'phone')) {
                $table->string('phone')->nullable()->after('is_visitor');
            } else {
                // Kung meron na, saka lang natin i-change ang properties nito
                $table->string('phone')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('members', function (Blueprint $table) {
            $table->dropForeign(['church_group_id']);
            $table->dropColumn(['church_group_id', 'is_visitor']);
        });
    }
};
