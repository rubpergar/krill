<?php

use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('GET /admin/leads redirige al login para invitados', function () {
    $response = $this->get('/admin/leads');

    $response->assertRedirect('/admin/login');
});

test('GET /admin/leads devuelve 403 para usuario inactivo autenticado', function () {
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertForbidden();
});

test('GET /admin/leads devuelve 200 para usuario activo autenticado', function () {
    $user = User::factory()->create(['activo' => true]);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertOk();
});

test('listado muestra datos del lead', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create([
        'nombre' => 'Juan Pérez',
        'email' => 'juan@example.com',
        'empresa' => 'Acme Corp',
        'tipo_necesidad' => 'Presupuesto',
        'mensaje' => 'Solicitud de presupuesto',
    ]);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertOk();
    $response->assertSee('Juan Pérez');
    $response->assertSee('juan@example.com');
    $response->assertSee('Acme Corp');
    $response->assertSee('Presupuesto');
    $response->assertSee('Nuevo');
});

test('listado tolera empresa y responsable nulos', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create([
        'empresa' => null,
        'responsable_id' => null,
    ]);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertOk();
});

test('listado muestra nombre del responsable cuando existe', function () {
    $responsable = User::factory()->create(['name' => 'Ana Admin', 'activo' => true]);
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create([
        'responsable_id' => $responsable->id,
    ]);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertOk();
    $response->assertSee('Ana Admin');
});

test('listado ordena por created_at descendente', function () {
    $user = User::factory()->create(['activo' => true]);
    $old = Lead::factory()->create(['created_at' => now()->subDay()]);
    $new = Lead::factory()->create(['created_at' => now()]);

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertOk();
    $response->assertSeeInOrder([$new->nombre, $old->nombre]);
});
