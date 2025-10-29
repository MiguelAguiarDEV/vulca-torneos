<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite no soporta modificar ENUMs directamente
        // Necesitamos recrear la tabla
        DB::statement('PRAGMA foreign_keys = OFF');

        // Crear tabla temporal con la nueva estructura
        Schema::table('registrations', function (Blueprint $table) {
            $table->string('payment_method_temp')->nullable();
        });

        // Copiar los datos a la columna temporal
        DB::statement('UPDATE registrations SET payment_method_temp = payment_method');

        // Eliminar la columna antigua
        Schema::table('registrations', function (Blueprint $table) {
            $table->dropColumn('payment_method');
        });

        // Crear la nueva columna con stripe incluido
        Schema::table('registrations', function (Blueprint $table) {
            $table->enum('payment_method', ['cash', 'transfer', 'card', 'stripe', 'free'])->default('cash');
        });

        // Copiar los datos de vuelta
        DB::statement('UPDATE registrations SET payment_method = payment_method_temp');

        // Eliminar la columna temporal
        Schema::table('registrations', function (Blueprint $table) {
            $table->dropColumn('payment_method_temp');
        });

        DB::statement('PRAGMA foreign_keys = ON');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir no es necesario para este caso
    }
};
