<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;

uses(RefreshDatabase::class);

test('notas_internas table has all columns', function () {
    expect(Schema::hasTable('notas_internas'))->toBeTrue();
    expect(Schema::hasColumn('notas_internas', 'lead_id'))->toBeTrue();
    expect(Schema::hasColumn('notas_internas', 'usuario_id'))->toBeTrue();
    expect(Schema::hasColumn('notas_internas', 'contenido'))->toBeTrue();
});

test('eventos_auditoria table has all columns', function () {
    expect(Schema::hasTable('eventos_auditoria'))->toBeTrue();
    expect(Schema::hasColumn('eventos_auditoria', 'lead_id'))->toBeTrue();
    expect(Schema::hasColumn('eventos_auditoria', 'usuario_id'))->toBeTrue();
    expect(Schema::hasColumn('eventos_auditoria', 'accion'))->toBeTrue();
    expect(Schema::hasColumn('eventos_auditoria', 'campo'))->toBeTrue();
    expect(Schema::hasColumn('eventos_auditoria', 'valor_anterior'))->toBeTrue();
    expect(Schema::hasColumn('eventos_auditoria', 'valor_nuevo'))->toBeTrue();
});
