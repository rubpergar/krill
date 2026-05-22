<?php

use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('GET /admin/leads/{id} redirige al login para invitados', function () {
    $lead = Lead::factory()->create();

    $response = $this->get("/admin/leads/{$lead->id}");

    $response->assertRedirect('/admin/login');
});

test('GET /admin/leads/{id} devuelve 403 para usuario inactivo autenticado', function () {
    $lead = Lead::factory()->create();
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertForbidden();
});

test('GET /admin/leads/{id} devuelve 200 y muestra los datos principales para usuario activo', function () {
    $responsable = User::factory()->create(['name' => 'Ana Responsable', 'activo' => true]);
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create([
        'nombre' => 'Juan Perez',
        'email' => 'juan@example.com',
        'telefono' => '600123123',
        'empresa' => 'Acme Corp',
        'tipo_necesidad' => 'Presupuesto',
        'estado' => 'Revisado',
        'responsable_id' => $responsable->id,
        'mensaje' => 'Necesito una propuesta comercial.',
        'consentimiento_aceptado' => true,
        'consentimiento_fecha' => now()->setDate(2026, 5, 22)->setTime(10, 30),
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Juan Perez');
    $response->assertSee('juan@example.com');
    $response->assertSee('600123123');
    $response->assertSee('Acme Corp');
    $response->assertSee('Presupuesto');
    $response->assertSee('Revisado');
    $response->assertSee('Ana Responsable');
    $response->assertSee('Necesito una propuesta comercial.');
});

test('detalle tolera campos opcionales nulos', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create([
        'empresa' => null,
        'telefono' => null,
        'responsable_id' => null,
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
});

test('GET /admin/leads/{id} devuelve 404 si el lead no existe', function () {
    $user = User::factory()->create(['activo' => true]);

    $response = $this->actingAs($user)->get('/admin/leads/999999');

    $response->assertNotFound();
});

test('listado expone un enlace visible hacia el detalle del lead', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    $response = $this->actingAs($user)->get('/admin/leads');

    $response->assertOk();
    $response->assertSee("/admin/leads/{$lead->id}", false);
});
