<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('churches', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100); // e.g. "Main Campus", "QC Church", "Cavite Church"
            $table->string('code', 10)->nullable()->unique(); // e.g. "CH-MAIN", "CH-QC"
            $table->text('address')->nullable();
            $table->string('contact_number', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->boolean('is_main_campus')->default(false); // Para matukoy kung main branch
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('churches');
    }
};
