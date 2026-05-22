<?php

use App\Filament\Resources\LeadResource\Pages\ViewLead;
use App\Models\Lead;
use App\Models\NotaInterna;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

test('detalle muestra una accion visible para añadir nota interna', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Añadir nota interna');
});

test('detalle muestra notas internas del lead con autor y contenido', function () {
    $user = User::factory()->create(['activo' => true]);
    $autor = User::factory()->create(['name' => 'Ana Seguimiento', 'activo' => true]);
    $lead = Lead::factory()->create();

    NotaInterna::factory()->create([
        'lead_id' => $lead->id,
        'usuario_id' => $autor->id,
        'contenido' => 'Primera nota interna',
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Notas internas');
    $response->assertSee('Ana Seguimiento');
    $response->assertSee('Primera nota interna');
});

test('detalle no mezcla notas de otros leads', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();
    $otroLead = Lead::factory()->create();

    NotaInterna::factory()->create([
        'lead_id' => $lead->id,
        'contenido' => 'Nota visible',
    ]);

    NotaInterna::factory()->create([
        'lead_id' => $otroLead->id,
        'contenido' => 'Nota ajena',
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSee('Nota visible');
    $response->assertDontSee('Nota ajena');
});

test('usuario activo puede crear una nota interna desde el detalle', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('addInternalNote', data: [
            'contenido' => 'Llamar al cliente mañana.',
        ]);

    $nota = NotaInterna::query()->sole();

    expect($nota->lead_id)->toBe($lead->id)
        ->and($nota->usuario_id)->toBe($user->id)
        ->and($nota->contenido)->toBe('Llamar al cliente mañana.');
});

test('contenido vacio o solo espacios es rechazado', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('addInternalNote', data: [
            'contenido' => '   ',
        ])
        ->assertHasFormErrors(['contenido']);

    expect(NotaInterna::count())->toBe(0);
});

test('detalle muestra notas de mas reciente a mas antigua', function () {
    $user = User::factory()->create(['activo' => true]);
    $lead = Lead::factory()->create();

    NotaInterna::factory()->create([
        'lead_id' => $lead->id,
        'contenido' => 'Nota antigua',
        'created_at' => now()->subHour(),
    ]);

    NotaInterna::factory()->create([
        'lead_id' => $lead->id,
        'contenido' => 'Nota reciente',
        'created_at' => now(),
    ]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertOk();
    $response->assertSeeInOrder(['Nota reciente', 'Nota antigua']);
});

test('GET /admin/leads/{id} mantiene 403 para usuario inactivo durante el flujo de notas', function () {
    $lead = Lead::factory()->create();
    $user = User::factory()->create(['activo' => false]);

    $response = $this->actingAs($user)->get("/admin/leads/{$lead->id}");

    $response->assertForbidden();
});
