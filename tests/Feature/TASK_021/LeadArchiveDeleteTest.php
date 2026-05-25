<?php

use App\Filament\Resources\LeadResource;
use App\Filament\Resources\LeadResource\Pages\ListLeads;
use App\Filament\Resources\LeadResource\Pages\ViewLead;
use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;

uses(RefreshDatabase::class);

function task021User(array $attributes = []): User
{
    return User::factory()->create(array_merge([
        'rol' => 'usuario',
        'activo' => true,
    ], $attributes));
}

function task021Admin(array $attributes = []): User
{
    return task021User(array_merge([
        'rol' => 'admin',
    ], $attributes));
}

test('listado excluye solicitudes archivadas por defecto', function () {
    $user = task021User();
    $active = Lead::factory()->create(['nombre' => 'Solicitud activa', 'archivado' => false]);
    $archived = Lead::factory()->archivado()->create(['nombre' => 'Solicitud archivada']);

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->assertCanSeeTableRecords(collect([$active]))
        ->assertCanNotSeeTableRecords(collect([$archived]));
});

test('filtro de archivado permite ver archivadas y todas', function () {
    $user = task021User();
    $active = Lead::factory()->create(['archivado' => false]);
    $archived = Lead::factory()->archivado()->create();

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->set('tableFilters.archivado.value', 'archived')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$archived]))
        ->assertCanNotSeeTableRecords(collect([$active]))
        ->set('tableFilters.archivado.value', 'all')
        ->call('applyTableFilters')
        ->assertCanSeeTableRecords(collect([$active, $archived]));
});

test('usuario activo puede archivar desde listado y registra auditoria', function () {
    $user = task021User();
    $lead = Lead::factory()->create(['archivado' => false]);

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->callTableAction('archive', $lead);

    expect($lead->refresh()->archivado)->toBeTrue();

    $evento = EventoAuditoria::query()->sole();
    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('archivado')
        ->and($evento->campo)->toBe('archivado')
        ->and($evento->valor_anterior)->toBe('false')
        ->and($evento->valor_nuevo)->toBe('true');
});

test('usuario activo puede restaurar desde detalle y registra auditoria', function () {
    $user = task021User();
    $lead = Lead::factory()->archivado()->create();

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->callAction('restore');

    expect($lead->refresh()->archivado)->toBeFalse();

    $evento = EventoAuditoria::query()->sole();
    expect($evento->lead_id)->toBe($lead->id)
        ->and($evento->usuario_id)->toBe($user->id)
        ->and($evento->accion)->toBe('restaurado')
        ->and($evento->campo)->toBe('archivado')
        ->and($evento->valor_anterior)->toBe('true')
        ->and($evento->valor_nuevo)->toBe('false');
});

test('archivar ya archivada y restaurar activa son no-op', function () {
    $user = task021User();
    $archived = Lead::factory()->archivado()->create();
    $active = Lead::factory()->create(['archivado' => false]);

    $this->actingAs($user);

    LeadResource::archiveLead($archived);
    LeadResource::restoreLead($active);

    expect($archived->refresh()->archivado)->toBeTrue()
        ->and($active->refresh()->archivado)->toBeFalse()
        ->and(EventoAuditoria::count())->toBe(0);
});

test('usuario no admin no ve eliminacion fisica', function () {
    $user = task021User();
    $lead = Lead::factory()->archivado()->create();

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->set('tableFilters.archivado.value', 'archived')
        ->call('applyTableFilters')
        ->assertTableActionHidden('deleteLead', $lead);

    Livewire::actingAs($user)
        ->test(ViewLead::class, ['record' => $lead->getRouteKey()])
        ->assertActionHidden('deleteLead');
});

test('admin puede eliminar fisicamente una solicitud archivada', function () {
    $admin = task021Admin();
    $lead = Lead::factory()->archivado()->create();

    Livewire::actingAs($admin)
        ->test(ListLeads::class)
        ->set('tableFilters.archivado.value', 'archived')
        ->call('applyTableFilters')
        ->callTableAction('deleteLead', $lead);

    expect(Lead::query()->whereKey($lead->id)->exists())->toBeFalse();
});

test('admin no puede eliminar fisicamente una solicitud activa', function () {
    $admin = task021Admin();
    $lead = Lead::factory()->create(['archivado' => false]);

    Livewire::actingAs($admin)
        ->test(ListLeads::class)
        ->assertTableActionHidden('deleteLead', $lead);
});
