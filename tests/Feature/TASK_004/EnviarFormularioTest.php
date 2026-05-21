<?php

use App\Enums\LeadStatus;
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
            'consentimiento' => '1',
        ], $overrides);
    }
}

test('POST / crea un lead válido y redirige a confirmación', function () {
    $response = $this
        ->withHeader('User-Agent', 'Pest Test Agent')
        ->post('/', payloadValido());

    $response->assertRedirect('/gracias');

    expect(Lead::count())->toBe(1);

    $lead = Lead::first();

    expect($lead->nombre)->toBe('Ada Lovelace')
        ->and($lead->email)->toBe('ada@example.com')
        ->and($lead->telefono)->toBe('+34 600 123 123')
        ->and($lead->empresa)->toBe('Analytical Engines')
        ->and($lead->tipo_necesidad->value)->toBe('Consulta')
        ->and($lead->mensaje)->toBe('Necesito una propuesta para el formulario.')
        ->and($lead->estado)->toBe(LeadStatus::Nuevo)
        ->and($lead->origen)->toBe('web')
        ->and($lead->user_agent)->toBe('Pest Test Agent')
        ->and($lead->consentimiento_aceptado)->toBeTrue()
        ->and($lead->consentimiento_fecha)->not->toBeNull();
});

test('POST / rechaza campos obligatorios ausentes', function () {
    $response = $this->from('/')->post('/', []);

    $response->assertRedirect('/');
    $response->assertSessionHasErrors([
        'nombre',
        'email',
        'telefono',
        'empresa',
        'tipo_necesidad',
        'mensaje',
        'consentimiento',
    ]);

    expect(Lead::count())->toBe(0);
});

test('POST / rechaza email inválido', function () {
    $response = $this->from('/')->post('/', payloadValido([
        'email' => 'no-es-email',
    ]));

    $response->assertRedirect('/');
    $response->assertSessionHasErrors(['email']);

    expect(Lead::count())->toBe(0);
});

test('POST / rechaza tipo de necesidad fuera del enum', function () {
    $response = $this->from('/')->post('/', payloadValido([
        'tipo_necesidad' => 'Desarrollo',
    ]));

    $response->assertRedirect('/');
    $response->assertSessionHasErrors(['tipo_necesidad']);

    expect(Lead::count())->toBe(0);
});

test('POST / exige consentimiento explícito', function () {
    $response = $this->from('/')->post('/', payloadValido([
        'consentimiento' => '0',
    ]));

    $response->assertRedirect('/');
    $response->assertSessionHasErrors(['consentimiento']);

    expect(Lead::count())->toBe(0);
});
