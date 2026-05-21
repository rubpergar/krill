<?php

use App\Enums\LeadStatus;
use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\NotaInterna;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('Lead model has fillable attributes and casts', function () {
    $lead = Lead::factory()->create();

    expect($lead)->toBeInstanceOf(Lead::class);
    expect($lead->estado)->toBe(LeadStatus::Nuevo);
    expect($lead->archivado)->toBeFalse();
});

test('Lead belongs to User (responsable)', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create(['responsable_id' => $user->id]);

    expect($lead->responsable)->toBeInstanceOf(User::class);
    expect($lead->responsable->id)->toBe($user->id);
});

test('Lead has many NotaInterna', function () {
    $lead = Lead::factory()->create();
    $nota = NotaInterna::factory()->create(['lead_id' => $lead->id]);

    expect($lead->notas)->toHaveCount(1);
    expect($lead->notas->first())->toBeInstanceOf(NotaInterna::class);
});

test('Lead has many EventoAuditoria', function () {
    $lead = Lead::factory()->create();
    $evento = EventoAuditoria::factory()->create(['lead_id' => $lead->id]);

    expect($lead->eventos)->toHaveCount(1);
    expect($lead->eventos->first())->toBeInstanceOf(EventoAuditoria::class);
});

test('NotaInterna belongs to Lead and User', function () {
    $nota = NotaInterna::factory()->create();

    expect($nota->lead)->toBeInstanceOf(Lead::class);
    expect($nota->usuario)->toBeInstanceOf(User::class);
});

test('EventoAuditoria belongs to Lead', function () {
    $evento = EventoAuditoria::factory()->create();

    expect($evento->lead)->toBeInstanceOf(Lead::class);
});
