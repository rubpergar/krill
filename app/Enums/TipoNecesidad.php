<?php

namespace App\Enums;

enum TipoNecesidad: string
{
    case Consulta = 'Consulta';
    case Presupuesto = 'Presupuesto';
    case Colaboracion = 'Colaboración';
    case Soporte = 'Soporte';
    case Otro = 'Otro';
}
