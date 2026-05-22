<?php

use App\Filament\Resources\LeadResource\Pages\ViewLead;
use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

test('detalle muestra una accion visible para cambiar estado', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Cambiar estado');
});

test('usuario activo puede cambiar el estado y registrar auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('changeStatus', data: [
            'estado' => 'Contactado',
        ]);

    expect($lead->refresh()->estado->value)->toBe('Contactado');

    $evento = EventoAuditoria::query()->sole();

    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('cambio_estado')
        ->and($evento->campo)->toBe('estado')
        ->and($evento->valor_anterior)->toBe('Nuevo')
        ->and($evento->valor_nuevo)->toBe('Contactado');
});

test('repetir el mismo estado no crea auditoria nueva', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Revisado']);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('changeStatus', data: [
            'estado' => 'Revisado',
        ]);

    expect($lead->refresh()->estado->value)->toBe('Revisado');
    expect(EventoAuditoria::count())->toBe(0);
});

test('estado invalido es rechazado sin modificar datos ni crear auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('changeStatus', data: [
            'estado' => 'No existe',
        ])
        ->assertHasFormErrors(['estado']);

    expect($lead->refresh()->estado->value)->toBe('Nuevo');
    expect(EventoAuditoria::count())->toBe(0);
});

test('GET /admin/leads/{id} mantiene 403 para usuario inactivo durante el flujo de cambio de estado', function () {
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertForbidden();
});
