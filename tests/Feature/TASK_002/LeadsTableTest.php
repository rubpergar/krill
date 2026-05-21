<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('leads table has all required columns', function () {
    expect(Schema::hasTable('leads'))->toBeTrue();

    $columns = ['nombre', 'email', 'telefono', 'empresa', 'tipo_necesidad', 'mensaje', 'estado', 'responsable_id', 'origen', 'ip_origen', 'user_agent', 'consentimiento_aceptado', 'consentimiento_fecha', 'archivado'];

    foreach ($columns as $column) {
        expect(Schema::hasColumn('leads', $column))
            ->toBeTrue("Column '$column' missing in leads table");
    }
});
