<?php

use App\Enums\LeadStatus;
use App\Enums\TipoNecesidad;

test('LeadStatus enum has all expected cases', function () {
    $cases = LeadStatus::cases();

    $labels = array_map(fn ($case) => $case->value, $cases);

    expect($labels)->toContain('Nuevo');
    expect($labels)->toContain('Revisado');
    expect($labels)->toContain('Contactado');
    expect($labels)->toContain('En seguimiento');
    expect($labels)->toContain('Convertido');
    expect($labels)->toContain('Descartado');
});

test('TipoNecesidad enum has all expected cases', function () {
    $cases = TipoNecesidad::cases();

    $labels = array_map(fn ($case) => $case->value, $cases);

    expect($labels)->toContain('Consulta');
    expect($labels)->toContain('Presupuesto');
    expect($labels)->toContain('Colaboración');
    expect($labels)->toContain('Soporte');
    expect($labels)->toContain('Otro');
});
