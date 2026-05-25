<?php

namespace App\Filament\Resources\LeadResource\Pages;

use App\Enums\LeadStatus;
use App\Filament\Resources\LeadResource;
use App\Models\EventoAuditoria;
use App\Models\NotaInterna;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Pages\ViewRecord;

class ViewLead extends ViewRecord
{
    protected static string $resource = LeadResource::class;

    public function markAsConverted(): void
    {
        $this->quickClose(LeadStatus::Convertido);
    }

    public function markAsDiscarded(): void
    {
        $this->quickClose(LeadStatus::Descartado);
    }

    private function quickClose(LeadStatus $targetStatus): void
    {
        $previousValue = $this->record->estado instanceof LeadStatus
            ? $this->record->estado->value
            : $this->record->estado;

        $targetValue = $targetStatus->value;

        if ($previousValue === $targetValue) {
            return;
        }

        $this->record->update([
            'estado' => $targetValue,
        ]);

        EventoAuditoria::create([
            'lead_id' => $this->record->getKey(),
            'usuario_id' => auth()->id(),
            'accion' => 'cambio_estado',
            'campo' => 'estado',
            'valor_anterior' => $previousValue,
            'valor_nuevo' => $targetValue,
        ]);

        $this->record->refresh();
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('archive')
                ->label('Archivar')
                ->color('warning')
                ->icon('heroicon-o-archive-box')
                ->requiresConfirmation()
                ->hidden(fn (): bool => $this->record->archivado)
                ->action(fn () => LeadResource::archiveLead($this->record)),
            Action::make('restore')
                ->label('Restaurar')
                ->color('info')
                ->icon('heroicon-o-arrow-path')
                ->requiresConfirmation()
                ->hidden(fn (): bool => ! $this->record->archivado)
                ->action(fn () => LeadResource::restoreLead($this->record)),
            Action::make('deleteLead')
                ->label('Eliminar')
                ->color('danger')
                ->icon('heroicon-o-trash')
                ->requiresConfirmation()
                ->hidden(fn (): bool => ! LeadResource::canDeleteLead($this->record))
                ->action(fn () => LeadResource::deleteLead($this->record)),
            Action::make('markAsConverted')
                ->label('Marcar como convertido')
                ->color('success')
                ->icon('heroicon-o-check-circle')
                ->requiresConfirmation()
                ->action(fn () => $this->markAsConverted()),
            Action::make('markAsDiscarded')
                ->label('Marcar como descartado')
                ->color('danger')
                ->icon('heroicon-o-x-circle')
                ->requiresConfirmation()
                ->action(fn () => $this->markAsDiscarded()),
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
            Action::make('assignResponsable')
                ->label('Asignar responsable')
                ->form([
                    Select::make('responsable_id')
                        ->label('Responsable')
                        ->options(function (): array {
                            $users = User::query()
                                ->where('activo', true)
                                ->pluck('name', 'id')
                                ->toArray();

                            return ['' => 'Sin responsable'] + $users;
                        })
                        ->native(false),
                ])
                ->action(function (array $data): void {
                    $selectedId = blank($data['responsable_id']) ? null : (int) $data['responsable_id'];
                    $currentId = $this->record->responsable_id;

                    if ($currentId === $selectedId) {
                        return;
                    }

                    $previousName = $currentId !== null
                        ? User::find($currentId)?->name ?? ''
                        : '';

                    $nextName = $selectedId !== null
                        ? User::find($selectedId)?->name ?? 'Sin responsable'
                        : 'Sin responsable';

                    $this->record->update([
                        'responsable_id' => $selectedId,
                    ]);

                    EventoAuditoria::create([
                        'lead_id' => $this->record->getKey(),
                        'usuario_id' => auth()->id(),
                        'accion' => 'asignacion',
                        'campo' => 'responsable_id',
                        'valor_anterior' => $previousName,
                        'valor_nuevo' => $nextName,
                    ]);

                    $this->record->refresh();
                }),
        ];
    }
}
