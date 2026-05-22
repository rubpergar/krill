<?php

use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

if (! function_exists('payloadValido')) {
    function payloadValido(array $overrides = []): array
    {
        return array_merge([
            'nombre' => 'Ada Lovelace',
            'email' => 'ada@example.com',
            'telefono' => '+34 600 123 123',
            'empresa' => 'Analytical Engines',
            'tipo_necesidad' => 'Consulta',
            'mensaje' => 'Necesito una propuesta para el formulario.',
            'website_url' => '',
            'consentimiento' => '1',
        ], $overrides);
    }
}

test('GET /gracias devuelve 200 con mensaje de confirmacion', function () {
    $response = $this->get('/gracias');

    $response->assertStatus(200);
    $response->assertSee('Solicitud recibida');
});

test('GET /gracias contiene enlace para volver al formulario', function () {
    $response = $this->get('/gracias');

    $response->assertSee('Volver');
    $response->assertSee('/');
});

test('POST / valido redirige a /gracias con PRG', function () {
    $response = $this
        ->withHeader('User-Agent', 'Pest Test Agent')
        ->post('/', payloadValido());

    $response->assertRedirect('/gracias');

    expect(Lead::count())->toBe(1);
    $lead = Lead::first();
    expect($lead->nombre)->toBe('Ada Lovelace');
    expect($lead->estado->value)->toBe('Nuevo');
});

test('GET /gracias es accesible directamente sin sesion previa', function () {
    $response = $this->get('/gracias');

    $response->assertStatus(200);
    $response->assertDontSee('Ada Lovelace');
    $response->assertDontSee('ada@example.com');
});

test('POST / invalido sigue redirigiendo a / con errores', function () {
    $response = $this->from('/')->post('/', []);

    $response->assertRedirect('/');
    $response->assertSessionHasErrors(['nombre', 'email', 'telefono', 'empresa', 'tipo_necesidad', 'mensaje', 'consentimiento']);

    expect(Lead::count())->toBe(0);
});
