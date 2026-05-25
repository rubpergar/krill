<?php

use App\Filament\Resources\UserResource\Pages\CreateUser;
use App\Filament\Resources\UserResource\Pages\EditUser;
use App\Filament\Resources\UserResource\Pages\ListUsers;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Livewire\Livewire;

uses(RefreshDatabase::class);

function adminUser(array $attributes = []): User
{
    return User::factory()->create(array_merge([
        'rol' => 'admin',
        'activo' => true,
    ], $attributes));
}

test('GET /admin/users redirige al login para invitados', function () {
    $response = $this->get('/admin/users');

    $response->assertRedirect('/admin/login');
});

test('usuario inactivo recibe 403 en usuarios', function () {
    $user = adminUser(['activo' => false]);

    $response = $this->actingAs($user)->get('/admin/users');

    $response->assertForbidden();
});

test('usuario activo no admin recibe 403 en usuarios', function () {
    $user = User::factory()->create(['rol' => 'usuario', 'activo' => true]);

    $response = $this->actingAs($user)->get('/admin/users');

    $response->assertForbidden();
});

test('admin activo puede listar usuarios', function () {
    $admin = adminUser();
    User::factory()->create([
        'name' => 'Ana Operaciones',
        'email' => 'ana@example.com',
        'rol' => 'usuario',
        'activo' => false,
    ]);

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertOk();
    $response->assertSee('Ana Operaciones');
    $response->assertSee('ana@example.com');
    $response->assertSee('usuario');
    $response->assertSee('Inactivo');
});

test('crear usuario valida campos requeridos', function () {
    $admin = adminUser();

    Livewire::actingAs($admin)
        ->test(CreateUser::class)
        ->fillForm([
            'name' => null,
            'email' => null,
            'password' => null,
            'rol' => 'editor',
        ])
        ->call('create')
        ->assertHasFormErrors([
            'name' => 'required',
            'email' => 'required',
            'password' => 'required',
            'rol' => 'in',
        ]);
});

test('admin puede crear usuario con password hasheada rol y estado', function () {
    $admin = adminUser();

    Livewire::actingAs($admin)
        ->test(CreateUser::class)
        ->fillForm([
            'name' => 'Carlos Admin',
            'email' => 'carlos@example.com',
            'password' => 'secret-password',
            'rol' => 'admin',
            'activo' => false,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $created = User::query()->where('email', 'carlos@example.com')->sole();

    expect($created->name)->toBe('Carlos Admin')
        ->and($created->rol)->toBe('admin')
        ->and($created->activo)->toBeFalse()
        ->and(Hash::check('secret-password', $created->password))->toBeTrue();
});

test('editar usuario sin password mantiene password actual', function () {
    $admin = adminUser();
    $target = User::factory()->create([
        'name' => 'Laura Antigua',
        'email' => 'laura@example.com',
        'password' => Hash::make('old-password'),
        'rol' => 'usuario',
        'activo' => true,
    ]);

    Livewire::actingAs($admin)
        ->test(EditUser::class, ['record' => $target->getRouteKey()])
        ->fillForm([
            'name' => 'Laura Nueva',
            'email' => 'laura.nueva@example.com',
            'password' => null,
            'rol' => 'admin',
            'activo' => false,
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $target->refresh();

    expect($target->name)->toBe('Laura Nueva')
        ->and($target->email)->toBe('laura.nueva@example.com')
        ->and($target->rol)->toBe('admin')
        ->and($target->activo)->toBeFalse()
        ->and(Hash::check('old-password', $target->password))->toBeTrue();
});

test('admin puede activar y desactivar otro usuario desde el listado', function () {
    $admin = adminUser();
    $target = User::factory()->create(['activo' => true]);

    Livewire::actingAs($admin)
        ->test(ListUsers::class)
        ->callTableAction('toggleActive', $target);

    expect($target->refresh()->activo)->toBeFalse();

    Livewire::actingAs($admin)
        ->test(ListUsers::class)
        ->callTableAction('toggleActive', $target);

    expect($target->refresh()->activo)->toBeTrue();
});

test('resource de usuarios no expone borrado fisico', function () {
    $admin = adminUser();
    $target = User::factory()->create();

    $listResponse = $this->actingAs($admin)->get('/admin/users');
    $editResponse = $this->actingAs($admin)->get("/admin/users/{$target->id}/edit");

    $listResponse->assertOk();
    $editResponse->assertOk();
    $listResponse->assertDontSee('Delete');
    $editResponse->assertDontSee('Delete');
});

test('admin no puede desactivarse a si mismo desde el listado', function () {
    $admin = adminUser();

    Livewire::actingAs($admin)
        ->test(ListUsers::class)
        ->callTableAction('toggleActive', $admin);

    expect($admin->refresh()->activo)->toBeTrue();
});
