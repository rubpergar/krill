<?php

use App\Filament\Resources\LeadResource\Pages\ListLeads;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create(['activo' => true]);
});

test('pagina de listado muestra los controles de filtro', function () {
    $this->actingAs($this->user)
        ->get('/admin/leads')
        ->assertOk()
        ->assertSee('fi-ta-filters-dropdown')
        ->assertSee('fi-ta-search-field');
});

test('filtro por estado devuelve solo leads con ese estado', function () {
    $nuevo = Lead::factory()->create(['estado' => 'Nuevo']);
    $revisado = Lead::factory()->create(['estado' => 'Revisado']);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.estado.value', 'Nuevo')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$nuevo]))
        ->assertCanNotSeeTableRecords(collect([$revisado]));
});

test('filtro por tipo de necesidad devuelve solo leads con ese tipo', function () {
    $consulta = Lead::factory()->create(['tipo_necesidad' => 'Consulta']);
    $soporte = Lead::factory()->create(['tipo_necesidad' => 'Soporte']);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.tipo_necesidad.value', 'Consulta')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$consulta]))
        ->assertCanNotSeeTableRecords(collect([$soporte]));
});

test('filtro de texto libre busca en nombre', function () {
    $juan = Lead::factory()->create(['nombre' => 'Juan Pérez']);
    $maria = Lead::factory()->create(['nombre' => 'María López']);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.search.value', 'Juan')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$juan]))
        ->assertCanNotSeeTableRecords(collect([$maria]));
});

test('filtro de texto libre busca en email', function () {
    $lead = Lead::factory()->create(['email' => 'cliente@example.com']);
    $otro = Lead::factory()->create();

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.search.value', 'cliente@example.com')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$lead]))
        ->assertCanNotSeeTableRecords(collect([$otro]));
});

test('filtro de texto libre busca en empresa', function () {
    $acme = Lead::factory()->create(['empresa' => 'Acme Corp']);
    $otra = Lead::factory()->create(['empresa' => 'Otra S.A.']);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.search.value', 'Acme')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$acme]))
        ->assertCanNotSeeTableRecords(collect([$otra]));
});

test('filtro de texto libre tolera valores nulos en empresa', function () {
    $lead = Lead::factory()->create([
        'nombre' => 'Pedro',
        'empresa' => null,
        'telefono' => null,
        'mensaje' => 'Hola mundo',
    ]);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.search.value', 'Pedro')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$lead]));
});

test('filtro de fecha created_from incluye leads desde esa fecha', function () {
    $hoy = Lead::factory()->create(['created_at' => now()]);
    $ayer = Lead::factory()->create(['created_at' => now()->subDay()]);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.created_at.created_from', now()->format('Y-m-d'))
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$hoy]))
        ->assertCanNotSeeTableRecords(collect([$ayer]));
});

test('filtro de fecha created_until incluye leads hasta esa fecha', function () {
    $ayer = Lead::factory()->create(['created_at' => now()->subDay()]);
    $hoy = Lead::factory()->create(['created_at' => now()]);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.created_at.created_until', now()->subDay()->format('Y-m-d'))
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$ayer]))
        ->assertCanNotSeeTableRecords(collect([$hoy]));
});

test('filtro por responsable usando relacion', function () {
    $admin = User::factory()->create(['name' => 'Admin User', 'activo' => true]);
    $asignado = Lead::factory()->asignado()->create([
        'responsable_id' => $admin->id,
    ]);
    $sinAsignar = Lead::factory()->create(['responsable_id' => null]);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.responsable_id.value', $admin->id)
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$asignado]));
});

test('filtros combinados actuan como interseccion', function () {
    $nuevoConsulta = Lead::factory()->create([
        'estado' => 'Nuevo',
        'tipo_necesidad' => 'Consulta',
    ]);
    $nuevoPresupuesto = Lead::factory()->create([
        'estado' => 'Nuevo',
        'tipo_necesidad' => 'Presupuesto',
    ]);

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->set('tableFilters.estado.value', 'Nuevo')
        ->set('tableFilters.tipo_necesidad.value', 'Presupuesto')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$nuevoPresupuesto]))
        ->assertCanNotSeeTableRecords(collect([$nuevoConsulta]));
});

test('combinacion sin filtros devuelve todo', function () {
    $a = Lead::factory()->create();
    $b = Lead::factory()->create();

    Livewire::actingAs($this->user)
        ->test(ListLeads::class)
        ->assertCanSeeTableRecords(collect([$a]))
        ->assertCanSeeTableRecords(collect([$b]));
});
