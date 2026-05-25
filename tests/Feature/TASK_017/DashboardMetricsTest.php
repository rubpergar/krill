<?php

use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('dashboard muestra metricas basicas con datos de leads', function () {
    $user = User::factory()->create(['activo' => true]);
    $responsable = User::factory()->create(['activo' => true]);

    Lead::factory()->count(3)->create(['estado' => 'Nuevo']);
    Lead::factory()->create(['estado' => 'Revisado']);
    Lead::factory()->create(['estado' => 'Contactado']);
    Lead::factory()->create(['estado' => 'En seguimiento']);
    Lead::factory()->create(['estado' => 'Convertido', 'responsable_id' => $responsable->id]);
    Lead::factory()->create(['estado' => 'Descartado', 'responsable_id' => $responsable->id]);
    Lead::factory()->create(['estado' => 'Revisado', 'responsable_id' => $responsable->id]);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertOk();
    $response->assertSee('Total de leads');
    $response->assertSee('Nuevos');
    $response->assertSee('Activos');
    $response->assertSee('Convertidos');
    $response->assertSee('Descartados');
    $response->assertSee('Sin responsable');
    $response->assertSee('8');
    $response->assertSee('3');
    $response->assertSee('1');
    $response->assertSee('4');
});

test('dashboard muestra ceros sin leads', function () {
    $user = User::factory()->create(['activo' => true]);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertOk();
    $response->assertSee('Total de leads');
    $response->assertSee('Nuevos');
    $response->assertSee('Activos');
    $response->assertSee('Convertidos');
    $response->assertSee('Descartados');
    $response->assertSee('Sin responsable');
    $response->assertSee('0');
});
