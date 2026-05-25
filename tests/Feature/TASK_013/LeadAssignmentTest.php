<?php

use App\Filament\Resources\LeadResource\Pages\ViewLead;
use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

test('detalle muestra una accion visible para asignar responsable', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Asignar responsable');
});

test('usuario activo puede asignar un responsable y registrar auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $responsable = User::factory()->create(['name' => 'Carlos Seguimiento', 'activo' => true]);
    $lead = Lead::factory()->create(['responsable_id' => null]);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('assignResponsable', data: [
            'responsable_id' => (string) $responsable->id,
        ]);

    expect($lead->refresh()->responsable_id)->toBe($responsable->id);

    $evento = EventoAuditoria::query()->sole();

    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('asignacion')
        ->and($evento->campo)->toBe('responsable_id')
        ->and($evento->valor_anterior)->toBe('')
        ->and($evento->valor_nuevo)->toBe('Carlos Seguimiento');
});

test('cambiar de responsable crea un evento de auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $anterior = User::factory()->create(['name' => 'Ana Anterior', 'activo' => true]);
    $nuevo = User::factory()->create(['name' => 'Nuevo Resp', 'activo' => true]);
    $lead = Lead::factory()->create(['responsable_id' => $anterior->id]);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('assignResponsable', data: [
            'responsable_id' => (string) $nuevo->id,
        ]);

    expect($lead->refresh()->responsable_id)->toBe($nuevo->id);

    $evento = EventoAuditoria::query()->sole();

    expect($evento->accion)->toBe('asignacion')
        ->and($evento->valor_anterior)->toBe('Ana Anterior')
        ->and($evento->valor_nuevo)->toBe('Nuevo Resp');
});

test('asignar el mismo responsable no crea auditoria nueva', function () {
    $user = User::factory()->create(['activo' => true]);
    $responsable = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['responsable_id' => $responsable->id]);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('assignResponsable', data: [
            'responsable_id' => (string) $responsable->id,
        ]);

    expect($lead->refresh()->responsable_id)->toBe($responsable->id);
    expect(EventoAuditoria::count())->toBe(0);
});

test('desasignar responsable desde uno existente crea auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $responsable = User::factory()->create(['name' => 'Sale Team', 'activo' => true]);
    $lead = Lead::factory()->create(['responsable_id' => $responsable->id]);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('assignResponsable', data: [
            'responsable_id' => '',
        ]);

    expect($lead->refresh()->responsable_id)->toBeNull();

    $evento = EventoAuditoria::query()->sole();

    expect($evento->accion)->toBe('asignacion')
        ->and($evento->valor_anterior)->toBe('Sale Team')
        ->and($evento->valor_nuevo)->toBe('Sin responsable');
});

test('asignar sin responsable cuando ya no hay es no-op', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['responsable_id' => null]);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('assignResponsable', data: [
            'responsable_id' => '',
        ]);

    expect($lead->refresh()->responsable_id)->toBeNull();
    expect(EventoAuditoria::count())->toBe(0);
});

test('GET /admin/leads/{id} mantiene 403 para usuario inactivo durante el flujo de asignacion', function () {
    $lead = Lead::factory()->create();
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertForbidden();
});
