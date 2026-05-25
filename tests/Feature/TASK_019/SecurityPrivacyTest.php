<?php

use App\Filament\Resources\LeadResource\Pages\ListLeads;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Livewire\Livewire;

uses(RefreshDatabase::class);

function task019Payload(array $overrides = []): array
{
    return array_merge([
        'nombre' => 'Persona Test',
        'email' => 'persona@example.com',
        'telefono' => '+34 600 000 000',
        'empresa' => 'Empresa Test',
        'tipo_necesidad' => 'Consulta',
        'mensaje' => 'Mensaje privado de prueba',
        'website_url' => '',
        'consentimiento' => '1',
    ], $overrides);
}

function task019User(array $attributes = []): User
{
    return User::factory()->create(array_merge([
        'rol' => 'usuario',
        'activo' => true,
    ], $attributes));
}

function task019RateLimitKey(string $ip): string
{
    return 'public-form:'.$ip;
}

test('pagina publica de privacidad existe y cubre informacion basica', function () {
    $this->get('/privacidad')
        ->assertOk()
        ->assertSee('Privacidad')
        ->assertSee('Finalidad')
        ->assertSee('Datos tratados')
        ->assertSee('Acceso interno')
        ->assertSee('Conservación');
});

test('formulario enlaza politica de privacidad desde consentimiento', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee('href="/privacidad"', false)
        ->assertSee('política de privacidad');
});

test('confirmacion no expone datos personales del envio', function () {
    $ip = '203.0.113.40';
    RateLimiter::clear(task019RateLimitKey($ip));

    $this->withServerVariables(['REMOTE_ADDR' => $ip])
        ->post('/', task019Payload())
        ->assertRedirect('/gracias');

    $this->get('/gracias')
        ->assertOk()
        ->assertDontSee('Persona Test')
        ->assertDontSee('persona@example.com')
        ->assertDontSee('+34 600 000 000')
        ->assertDontSee('Empresa Test')
        ->assertDontSee('Mensaje privado de prueba');
});

test('invitados no acceden a recursos privados', function () {
    $lead = Lead::factory()->create();

    $this->get('/admin/leads')->assertRedirect('/admin/login');
    $this->get("/admin/leads/{$lead->id}")->assertRedirect('/admin/login');
    $this->get('/admin/users')->assertRedirect('/admin/login');
});

test('usuarios inactivos no acceden a recursos privados', function () {
    $user = task019User(['activo' => false]);

    $this->actingAs($user)->get('/admin/leads')->assertForbidden();
    $this->actingAs($user)->get('/admin/users')->assertForbidden();
});

test('usuario no admin no gestiona usuarios ni elimina leads fisicamente', function () {
    $user = task019User(['rol' => 'usuario']);
    $lead = Lead::factory()->archivado()->create();

    $this->actingAs($user)->get('/admin/users')->assertForbidden();

    Livewire::actingAs($user)
        ->test(ListLeads::class)
        ->set('tableFilters.archivado.value', 'archived')
        ->call('applyTableFilters')
        ->assertTableActionHidden('deleteLead', $lead);
});

test('honeypot informado no crea solicitud', function () {
    $ip = '203.0.113.41';
    RateLimiter::clear(task019RateLimitKey($ip));

    $this->withServerVariables(['REMOTE_ADDR' => $ip])
        ->post('/', task019Payload(['website_url' => 'https://spam.example']))
        ->assertRedirect('/gracias');

    expect(Lead::count())->toBe(0);
});

test('rate limit bloquea envios excesivos', function () {
    $ip = '203.0.113.42';
    RateLimiter::clear(task019RateLimitKey($ip));

    for ($i = 0; $i < 5; $i++) {
        $this->withServerVariables(['REMOTE_ADDR' => $ip])
            ->post('/', task019Payload(['email' => "persona{$i}@example.com"]))
            ->assertRedirect('/gracias');
    }

    $this->withServerVariables(['REMOTE_ADDR' => $ip])
        ->post('/', task019Payload(['email' => 'exceso@example.com']))
        ->assertStatus(429);
});
