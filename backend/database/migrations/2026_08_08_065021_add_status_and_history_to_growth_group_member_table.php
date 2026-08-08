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
        Schema::table('growth_group_member', function (Blueprint $table) {
            $table->string('status')->default('active')->after('role')->index();
            $table->timestamp('ended_at')->nullable()->after('status');
            $table->text('inactive_reason')->nullable()->after('ended_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('growth_group_member', function (Blueprint $table) {
            $table->dropColumn(['status', 'ended_at', 'inactive_reason']);
        });
    }
};
