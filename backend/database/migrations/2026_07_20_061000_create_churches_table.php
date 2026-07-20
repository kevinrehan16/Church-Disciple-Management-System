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
            $table->string('name'); // e.g. "Main Campus", "QC Satellite", "Cavite Satellite"
            $table->string('code')->nullable()->unique(); // e.g. "CH-MAIN", "CH-QC"
            $table->text('address')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
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
