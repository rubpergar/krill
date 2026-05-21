<?php

namespace Database\Factories;

use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventoAuditoriaFactory extends Factory
{
    protected $model = EventoAuditoria::class;

    public function definition(): array
    {
        return [
            'lead_id' => Lead::factory(),
            'usuario_id' => User::factory(),
            'accion' => 'cambio_estado',
            'campo' => 'estado',
            'valor_anterior' => 'Nuevo',
            'valor_nuevo' => 'Revisado',
        ];
    }
}
