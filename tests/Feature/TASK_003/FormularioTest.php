<?php

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('GET / devuelve el formulario con todos los campos', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertSee('nombre');
    $response->assertSee('email');
    $response->assertSee('telefono');
    $response->assertSee('empresa');
    $response->assertSee('tipo_necesidad');
    $response->assertSee('mensaje');
    $response->assertSee('consentimiento');
});

test('los campos obligatorios tienen required', function () {
    $response = $this->get('/');

    $response->assertSee('required');
});

test('el campo honeypot existe y está oculto', function () {
    $response = $this->get('/');

    $response->assertSee('website_url');
});

test('el formulario tiene CSRF token', function () {
    $response = $this->get('/');

    $response->assertSee('_token');
});

test('hay un botón de envío', function () {
    $response = $this->get('/');

    $response->assertSee('Enviar');
});
