<?php

namespace App\Models;

use App\Enums\LeadStatus;
use App\Enums\TipoNecesidad;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre', 'email', 'telefono', 'empresa', 'tipo_necesidad',
        'mensaje', 'estado', 'responsable_id', 'origen', 'ip_origen',
        'user_agent', 'consentimiento_aceptado', 'consentimiento_fecha', 'archivado',
    ];

    protected function casts(): array
    {
        return [
            'consentimiento_aceptado' => 'boolean',
            'consentimiento_fecha' => 'datetime',
            'archivado' => 'boolean',
            'estado' => LeadStatus::class,
            'tipo_necesidad' => TipoNecesidad::class,
        ];
    }

    public function responsable(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsable_id');
    }

    public function notas(): HasMany
    {
        return $this->hasMany(NotaInterna::class, 'lead_id');
    }

    public function eventos(): HasMany
    {
        return $this->hasMany(EventoAuditoria::class, 'lead_id');
    }
}
