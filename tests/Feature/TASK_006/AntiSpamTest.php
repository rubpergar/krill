<?php

use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;

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

function rateLimitKey(string $ip): string
{
    return 'public-form:'.$ip;
}

test('POST / acepta un envio legitimo con honeypot vacio', function () {
    $ip = '203.0.113.10';

    RateLimiter::clear(rateLimitKey($ip));

    $response = $this
        ->withServerVariables(['REMOTE_ADDR' => $ip])
        ->post('/', payloadValido());

    $response->assertRedirect('/gracias');

    expect(Lead::count())->toBe(1);
});

test('POST / descarta un envio con honeypot informado', function () {
    $ip = '203.0.113.11';

    RateLimiter::clear(rateLimitKey($ip));

    $response = $this
        ->withServerVariables(['REMOTE_ADDR' => $ip])
        ->post('/', payloadValido([
            'website_url' => 'https://spam.example',
        ]));

    $response->assertRedirect('/gracias');

    expect(Lead::count())->toBe(0);
});

test('POST / responde 429 al superar el rate limit', function () {
    $ip = '203.0.113.12';

    RateLimiter::clear(rateLimitKey($ip));

    for ($i = 0; $i < 5; $i++) {
        $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->post('/', payloadValido())
            ->assertRedirect('/gracias');
    }

    $response = $this
        ->withServerVariables(['REMOTE_ADDR' => $ip])
        ->post('/', payloadValido());

    $response->assertStatus(429);

    expect(Lead::count())->toBe(5);
});
