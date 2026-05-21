<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventoAuditoria extends Model
{
    use HasFactory;

    protected $table = 'eventos_auditoria';

    protected $fillable = [
        'lead_id', 'usuario_id', 'accion', 'campo',
        'valor_anterior', 'valor_nuevo',
    ];

    public function lead(): BelongsTo
    {
        return $this->belongsTo(Lead::class, 'lead_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
