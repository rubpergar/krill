<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'nombre' => fake()->name(),
            'email' => fake()->safeEmail(),
            'telefono' => fake()->optional()->phoneNumber(),
            'empresa' => fake()->optional()->company(),
            'tipo_necesidad' => fake()->randomElement(['Consulta', 'Presupuesto', 'Colaboración', 'Soporte', 'Otro']),
            'mensaje' => fake()->paragraph(),
            'estado' => 'Nuevo',
            'responsable_id' => null,
            'origen' => null,
            'ip_origen' => null,
            'user_agent' => null,
            'consentimiento_aceptado' => true,
            'consentimiento_fecha' => now(),
            'archivado' => false,
        ];
    }

    public function asignado(): static
    {
        return $this->state(fn (array $attributes) => [
            'responsable_id' => User::factory(),
        ]);
    }

    public function archivado(): static
    {
        return $this->state(fn (array $attributes) => [
            'archivado' => true,
        ]);
    }
}
