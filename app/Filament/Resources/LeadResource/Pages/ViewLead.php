<?php

namespace App\Filament\Resources\LeadResource\Pages;

use App\Enums\LeadStatus;
use App\Filament\Resources\LeadResource;
use App\Models\EventoAuditoria;
use App\Models\NotaInterna;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Pages\ViewRecord;

class ViewLead extends ViewRecord
{
    protected static string $resource = LeadResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('changeStatus')
                ->label('Cambiar estado')
                ->form([
                    Select::make('estado')
                        ->label('Estado')
                        ->options(array_column(LeadStatus::cases(), 'value', 'value'))
                        ->required(),
                ])
                ->action(function (array $data): void {
                    $previousStatus = $this->record->estado instanceof LeadStatus
                        ? $this->record->estado->value
                        : $this->record->estado;

                    $nextStatus = $data['estado'];

                    if ($previousStatus === $nextStatus) {
                        return;
                    }

                    $this->record->update([
                        'estado' => $nextStatus,
                    ]);

                    EventoAuditoria::create([
                        'lead_id' => $this->record->getKey(),
                        'usuario_id' => auth()->id(),
                        'accion' => 'cambio_estado',
                        'campo' => 'estado',
                        'valor_anterior' => $previousStatus,
                        'valor_nuevo' => $nextStatus,
                    ]);

                    $this->record->refresh();
                }),
            Action::make('addInternalNote')
                ->label('Añadir nota interna')
                ->form([
                    Textarea::make('contenido')
                        ->label('Nota interna')
                        ->required()
                        ->rules(['regex:/\S/']),
                ])
                ->action(function (array $data): void {
                    NotaInterna::create([
                        'lead_id' => $this->record->getKey(),
                        'usuario_id' => auth()->id(),
                        'contenido' => trim($data['contenido']),
                    ]);

                    $this->record->refresh();
                }),
        ];
    }
}
