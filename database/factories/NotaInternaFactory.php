<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\NotaInterna;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotaInternaFactory extends Factory
{
    protected $model = NotaInterna::class;

    public function definition(): array
    {
        return [
            'lead_id' => Lead::factory(),
            'usuario_id' => User::factory(),
            'contenido' => fake()->paragraph(),
        ];
    }
}
