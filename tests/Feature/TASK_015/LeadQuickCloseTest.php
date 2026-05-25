<?php

use App\Filament\Resources\LeadResource\Pages\ListLeads;
use App\Filament\Resources\LeadResource\Pages\ViewLead;
use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

// --- Detail page header actions ---

test('detalle muestra acciones rapidas de convertir y descartar', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Marcar como convertido');
    $response->assertSee('Marcar como descartado');
});

test('marcar como convertido desde detalle cambia estado y registra auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('markAsConverted');

    expect($lead->refresh()->estado->value)->toBe('Convertido');

    $evento = EventoAuditoria::query()->sole();
    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('cambio_estado')
        ->and($evento->campo)->toBe('estado')
        ->and($evento->valor_anterior)->toBe('Nuevo')
        ->and($evento->valor_nuevo)->toBe('Convertido');
});

test('marcar como descartado desde detalle cambia estado y registra auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Revisado']);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('markAsDiscarded');

    expect($lead->refresh()->estado->value)->toBe('Descartado');

    $evento = EventoAuditoria::query()->sole();
    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('cambio_estado')
        ->and($evento->campo)->toBe('estado')
        ->and($evento->valor_anterior)->toBe('Revisado')
        ->and($evento->valor_nuevo)->toBe('Descartado');
});

test('marcar como convertido cuando ya es convertido es no-op', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Convertido']);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('markAsConverted');

    expect($lead->refresh()->estado->value)->toBe('Convertido');
    expect(EventoAuditoria::count())->toBe(0);
});

test('marcar como descartado cuando ya es descartado es no-op', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Descartado']);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('markAsDiscarded');

    expect($lead->refresh()->estado->value)->toBe('Descartado');
    expect(EventoAuditoria::count())->toBe(0);
});

// --- Table row actions ---

test('listado muestra acciones de convertir y descartar por fila', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertOk();
    $response->assertSee('Convertir');
    $response->assertSee('Descartar');
});

test('convertir desde listado cambia estado y registra auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Nuevo']);

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->callTableAction('convert', $lead);

    expect($lead->refresh()->estado->value)->toBe('Convertido');

    $evento = EventoAuditoria::query()->sole();
    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('cambio_estado')
        ->and($evento->campo)->toBe('estado')
        ->and($evento->valor_anterior)->toBe('Nuevo')
        ->and($evento->valor_nuevo)->toBe('Convertido');
});

test('descartar desde listado cambia estado y registra auditoria', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Contactado']);

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->callTableAction('discard', $lead);

    expect($lead->refresh()->estado->value)->toBe('Descartado');

    $evento = EventoAuditoria::query()->sole();
    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('cambio_estado')
        ->and($evento->campo)->toBe('estado')
        ->and($evento->valor_anterior)->toBe('Contactado')
        ->and($evento->valor_nuevo)->toBe('Descartado');
});

test('convertir desde listado cuando ya es convertido es no-op', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Convertido']);

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->callTableAction('convert', $lead);

    expect($lead->refresh()->estado->value)->toBe('Convertido');
    expect(EventoAuditoria::count())->toBe(0);
});

test('descartar desde listado cuando ya es descartado es no-op', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create(['estado' => 'Descartado']);

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->callTableAction('discard', $lead);

    expect($lead->refresh()->estado->value)->toBe('Descartado');
    expect(EventoAuditoria::count())->toBe(0);
});

// --- Access control ---

test('detalle mantiene 403 para usuario inactivo durante flujo de cierre rapido', function () {
    $lead = Lead::factory()->create();
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertForbidden();
});

test('listado mantiene 403 para usuario inactivo durante flujo de cierre rapido', function () {
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertForbidden();
});
