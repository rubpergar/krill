<?php

namespace App\Enums;

enum LeadStatus: string
{
    case Nuevo = 'Nuevo';
    case Revisado = 'Revisado';
    case Contactado = 'Contactado';
    case EnSeguimiento = 'En seguimiento';
    case Convertido = 'Convertido';
    case Descartado = 'Descartado';
}
