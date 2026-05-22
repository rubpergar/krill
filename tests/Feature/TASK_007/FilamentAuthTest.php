<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('GET /admin redirige al login para invitados', function () {
    $response = $this->get('/admin');

    $response->assertRedirect('/admin/login');
});

test('GET /admin/login muestra la pantalla de acceso', function () {
    $response = $this->get('/admin/login');

    $response->assertOk();
    $response->assertSee('email', escape: false);
});

test('usuario activo autenticado puede acceder al panel admin', function () {
    $user = User::factory()->create([
        'activo' => true,
    ]);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertOk();
});

test('usuario inactivo autenticado no puede acceder al panel admin', function () {
    $user = User::factory()->create([
        'activo' => false,
    ]);

    $response = $this->actingAs($user)->get('/admin');

    $response->assertForbidden();
});

test('logout del panel cierra la sesion y vuelve a proteger /admin', function () {
    $user = User::factory()->create([
        'activo' => true,
    ]);

    $this->actingAs($user)
        ->post('/admin/logout')
        ->assertRedirect('/admin/login');

    $this->get('/admin')->assertRedirect('/admin/login');
});
