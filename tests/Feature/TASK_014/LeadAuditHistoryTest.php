<?php

use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('detalle muestra historial de auditoria cuando existen eventos', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    EventoAuditoria::factory()->create([
        'lead_id' => $lead->id,
        'usuario_id' => $user->id,
        'accion' => 'cambio_estado',
        'campo' => 'estado',
        'valor_anterior' => 'Nuevo',
        'valor_nuevo' => 'Revisado',
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Historial de auditoría');
});

test('cada evento muestra accion, campo, valores, autor y fecha', function () {
    $user = User::factory()->create(['name' => 'Ana Admin', 'activo' => true]);
    $lead = Lead::factory()->create();

    EventoAuditoria::factory()->create([
        'lead_id' => $lead->id,
        'usuario_id' => $user->id,
        'accion' => 'cambio_estado',
        'campo' => 'estado',
        'valor_anterior' => 'Nuevo',
        'valor_nuevo' => 'Revisado',
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('cambio_estado');
    $response->assertSee('estado');
    $response->assertSee('Nuevo');
    $response->assertSee('Revisado');
    $response->assertSee('Ana Admin');
});

test('eventos se muestran de mas reciente a mas antiguo', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    EventoAuditoria::factory()->create([
        'lead_id' => $lead->id,
        'usuario_id' => $user->id,
        'accion' => 'asignacion',
        'created_at' => now()->subHour(),
    ]);

    EventoAuditoria::factory()->create([
        'lead_id' => $lead->id,
        'usuario_id' => $user->id,
        'accion' => 'cambio_estado',
        'created_at' => now(),
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSeeInOrder(['cambio_estado', 'asignacion']);
});

test('detalle no mezcla eventos de otros leads', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();
    $otroLead = Lead::factory()->create();

    EventoAuditoria::factory()->create([
        'lead_id' => $lead->id,
        'accion' => 'cambio_estado',
        'campo' => 'estado',
    ]);

    EventoAuditoria::factory()->create([
        'lead_id' => $otroLead->id,
        'accion' => 'asignacion',
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('cambio_estado');
    $response->assertDontSee('asignacion');
});

test('lead sin eventos muestra mensaje de placeholder', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Sin eventos de auditoría todavía.');
});

test('evento sin usuario asociado muestra Sistema como autor', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    EventoAuditoria::factory()->create([
        'lead_id' => $lead->id,
        'usuario_id' => null,
        'accion' => 'cambio_estado',
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Sistema');
});

test('GET /admin/leads/{id} mantiene 403 para usuario inactivo', function () {
    $lead = Lead::factory()->create();
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertForbidden();
});
