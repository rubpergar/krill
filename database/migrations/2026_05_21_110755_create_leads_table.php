<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('email');
            $table->string('telefono')->nullable();
            $table->string('empresa')->nullable();
            $table->string('tipo_necesidad');
            $table->text('mensaje');
            $table->string('estado')->default('Nuevo');
            $table->foreignId('responsable_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('origen')->nullable();
            $table->string('ip_origen')->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('consentimiento_aceptado')->default(false);
            $table->timestamp('consentimiento_fecha')->nullable();
            $table->boolean('archivado')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
