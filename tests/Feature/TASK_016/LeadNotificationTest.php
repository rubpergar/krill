<?php

use App\Mail\NewLeadNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    Mail::fake('resend');

    config()->set('mail.internal_notification_address', 'team@prawnforms.test');
});

test('envio del formulario envia notificacion email al destinatario configurado', function () {
    $this->post('/', [
        'nombre' => 'Juan Perez',
        'email' => 'juan@example.com',
        'telefono' => '612345678',
        'empresa' => 'Ejemplo SL',
        'tipo_necesidad' => 'Presupuesto',
        'mensaje' => 'Necesito un presupuesto.',
        'consentimiento' => '1',
    ]);

    Mail::assertSent(NewLeadNotification::class, function (NewLeadNotification $mail) {
        return $mail->hasTo('team@prawnforms.test')
            && $mail->lead->nombre === 'Juan Perez'
            && $mail->lead->email === 'juan@example.com';
    });
});

test('email contiene datos completos del lead', function () {
    $this->post('/', [
        'nombre' => 'Maria Garcia',
        'email' => 'maria@test.com',
        'telefono' => '655000111',
        'empresa' => 'TechCorp',
        'tipo_necesidad' => 'Consulta',
        'mensaje' => 'Quiero información sobre sus servicios.',
        'consentimiento' => '1',
    ]);

    Mail::assertSent(NewLeadNotification::class, function (NewLeadNotification $mail) {
        $html = $mail->render();

        return str_contains($html, 'Maria Garcia')
            && str_contains($html, 'maria@test.com')
            && str_contains($html, '655000111')
            && str_contains($html, 'TechCorp')
            && str_contains($html, 'Consulta')
            && str_contains($html, 'Quiero información sobre sus servicios.');
    });
});

test('no se envia notificacion cuando no hay destinatario configurado', function () {
    config()->set('mail.internal_notification_address', null);

    $this->post('/', [
        'nombre' => 'Sin Notif',
        'email' => 'sinn@test.com',
        'telefono' => '600000000',
        'empresa' => 'Test SL',
        'tipo_necesidad' => 'Otro',
        'mensaje' => 'Sin notificación.',
        'consentimiento' => '1',
    ]);

    Mail::assertNothingOutgoing();
});

test('email notification tiene asunto y destinatario correctos', function () {
    $this->post('/', [
        'nombre' => 'Asunto Test',
        'email' => 'asunto@test.com',
        'telefono' => '622222222',
        'empresa' => 'Asunto SL',
        'tipo_necesidad' => 'Presupuesto',
        'mensaje' => 'Test de asunto.',
        'consentimiento' => '1',
    ]);

    Mail::assertSent(NewLeadNotification::class, function (NewLeadNotification $mail) {
        return $mail->hasTo('team@prawnforms.test');
    });

    Mail::assertSent(NewLeadNotification::class, 1);
});
