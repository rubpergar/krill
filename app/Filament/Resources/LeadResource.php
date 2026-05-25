<?php

namespace App\Filament\Resources;

use App\Enums\LeadStatus;
use App\Enums\TipoNecesidad;
use App\Filament\Resources\LeadResource\Pages\ListLeads;
use App\Filament\Resources\LeadResource\Pages\ViewLead;
use App\Models\EventoAuditoria;
use App\Models\Lead;
use App\Models\User;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Infolists;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;

    protected static ?string $navigationLabel = 'Solicitudes';

    protected static ?string $slug = 'leads';

    protected static ?string $pluralModelLabel = 'Solicitudes';

    protected static ?string $modelLabel = 'Solicitud';

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->columns(2)
            ->components([
                Infolists\Components\TextEntry::make('nombre')
                    ->label('Nombre'),
                Infolists\Components\TextEntry::make('email')
                    ->label('Email'),
                Infolists\Components\TextEntry::make('telefono')
                    ->label('Teléfono')
                    ->placeholder('—'),
                Infolists\Components\TextEntry::make('empresa')
                    ->label('Empresa')
                    ->placeholder('—'),
                Infolists\Components\TextEntry::make('tipo_necesidad')
                    ->label('Tipo de necesidad')
                    ->badge()
                    ->formatStateUsing(fn (mixed $state): ?string => $state instanceof TipoNecesidad ? $state->value : $state),
                Infolists\Components\TextEntry::make('estado')
                    ->label('Estado')
                    ->badge()
                    ->formatStateUsing(fn (mixed $state): ?string => $state instanceof LeadStatus ? $state->value : $state),
                Infolists\Components\TextEntry::make('responsable.name')
                    ->label('Responsable')
                    ->placeholder('—'),
                Infolists\Components\TextEntry::make('origen')
                    ->label('Origen')
                    ->placeholder('—'),
                Infolists\Components\TextEntry::make('consentimiento_aceptado')
                    ->label('Consentimiento')
                    ->formatStateUsing(fn (bool $state): string => $state ? 'Aceptado' : 'No aceptado'),
                Infolists\Components\TextEntry::make('consentimiento_fecha')
                    ->label('Fecha de consentimiento')
                    ->dateTime('d/m/Y H:i')
                    ->placeholder('—'),
                Infolists\Components\TextEntry::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y H:i'),
                Infolists\Components\TextEntry::make('mensaje')
                    ->label('Mensaje')
                    ->columnSpanFull()
                    ->placeholder('—'),
                Infolists\Components\TextEntry::make('notas_vacias')
                    ->label('Notas internas')
                    ->state('Sin notas internas todavía.')
                    ->columnSpanFull()
                    ->hidden(fn (Lead $record): bool => $record->notas()->exists()),
                Infolists\Components\RepeatableEntry::make('notas')
                    ->label('Notas internas')
                    ->state(fn (Lead $record): array => $record->notas()
                        ->with('usuario')
                        ->latest()
                        ->get()
                        ->map(fn ($nota): array => [
                            'contenido' => $nota->contenido,
                            'usuario' => ['name' => $nota->usuario?->name],
                            'created_at' => $nota->created_at,
                        ])
                        ->all())
                    ->schema([
                        Infolists\Components\TextEntry::make('usuario.name')
                            ->label('Autor')
                            ->placeholder('—'),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Fecha')
                            ->dateTime('d/m/Y H:i'),
                        Infolists\Components\TextEntry::make('contenido')
                            ->label('Nota')
                            ->columnSpanFull(),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->hidden(fn (Lead $record): bool => ! $record->notas()->exists()),
                Infolists\Components\TextEntry::make('eventos_vacios')
                    ->label('Historial de auditoría')
                    ->state('Sin eventos de auditoría todavía.')
                    ->columnSpanFull()
                    ->hidden(fn (Lead $record): bool => $record->eventos()->exists()),
                Infolists\Components\RepeatableEntry::make('eventos')
                    ->label('Historial de auditoría')
                    ->state(fn (Lead $record): array => $record->eventos()
                        ->with('usuario')
                        ->latest()
                        ->get()
                        ->map(fn ($evento): array => [
                            'accion' => $evento->accion,
                            'campo' => $evento->campo,
                            'valor_anterior' => $evento->valor_anterior,
                            'valor_nuevo' => $evento->valor_nuevo,
                            'usuario' => ['name' => $evento->usuario?->name ?? 'Sistema'],
                            'created_at' => $evento->created_at,
                        ])
                        ->all())
                    ->schema([
                        Infolists\Components\TextEntry::make('accion')
                            ->label('Acción'),
                        Infolists\Components\TextEntry::make('campo')
                            ->label('Campo'),
                        Infolists\Components\TextEntry::make('valor_anterior')
                            ->label('Valor anterior'),
                        Infolists\Components\TextEntry::make('valor_nuevo')
                            ->label('Valor nuevo'),
                        Infolists\Components\TextEntry::make('usuario.name')
                            ->label('Autor'),
                        Infolists\Components\TextEntry::make('created_at')
                            ->label('Fecha')
                            ->dateTime('d/m/Y H:i'),
                    ])
                    ->columns(3)
                    ->columnSpanFull()
                    ->hidden(fn (Lead $record): bool => ! $record->eventos()->exists()),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('nombre')
                    ->label('Nombre')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),
                TextColumn::make('empresa')
                    ->label('Empresa')
                    ->placeholder('—'),
                TextColumn::make('tipo_necesidad')
                    ->label('Tipo de necesidad')
                    ->badge()
                    ->color(fn (mixed $state): string => match ($state instanceof TipoNecesidad ? $state->value : $state) {
                        TipoNecesidad::Consulta->value => 'info',
                        TipoNecesidad::Presupuesto->value => 'warning',
                        TipoNecesidad::Colaboracion->value => 'primary',
                        TipoNecesidad::Soporte->value => 'gray',
                        TipoNecesidad::Otro->value => 'secondary',
                        default => 'gray',
                    }),
                TextColumn::make('estado')
                    ->label('Estado')
                    ->badge()
                    ->color(fn (mixed $state): string => match ($state instanceof LeadStatus ? $state->value : $state) {
                        LeadStatus::Nuevo->value => 'gray',
                        LeadStatus::Revisado->value => 'info',
                        LeadStatus::Contactado->value => 'warning',
                        LeadStatus::EnSeguimiento->value => 'primary',
                        LeadStatus::Convertido->value => 'success',
                        LeadStatus::Descartado->value => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('responsable.name')
                    ->label('Responsable')
                    ->placeholder('—'),
                TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('Ver')
                    ->url(fn (Lead $record): string => static::getUrl('view', ['record' => $record])),
                Action::make('archive')
                    ->label('Archivar')
                    ->color('warning')
                    ->icon('heroicon-o-archive-box')
                    ->requiresConfirmation()
                    ->hidden(fn (Lead $record): bool => $record->archivado)
                    ->action(fn (Lead $record): null => static::archiveLead($record)),
                Action::make('restore')
                    ->label('Restaurar')
                    ->color('info')
                    ->icon('heroicon-o-arrow-path')
                    ->requiresConfirmation()
                    ->hidden(fn (Lead $record): bool => ! $record->archivado)
                    ->action(fn (Lead $record): null => static::restoreLead($record)),
                Action::make('deleteLead')
                    ->label('Eliminar')
                    ->color('danger')
                    ->icon('heroicon-o-trash')
                    ->requiresConfirmation()
                    ->hidden(fn (Lead $record): bool => ! static::canDeleteLead($record))
                    ->action(fn (Lead $record): null => static::deleteLead($record)),
                Action::make('convert')
                    ->label('Convertir')
                    ->color('success')
                    ->icon('heroicon-o-check-circle')
                    ->requiresConfirmation()
                    ->action(function (Lead $record): void {
                        $previousValue = $record->estado instanceof LeadStatus
                            ? $record->estado->value
                            : $record->estado;

                        if ($previousValue === LeadStatus::Convertido->value) {
                            return;
                        }

                        $record->update([
                            'estado' => LeadStatus::Convertido->value,
                        ]);

                        EventoAuditoria::create([
                            'lead_id' => $record->getKey(),
                            'usuario_id' => auth()->id(),
                            'accion' => 'cambio_estado',
                            'campo' => 'estado',
                            'valor_anterior' => $previousValue,
                            'valor_nuevo' => LeadStatus::Convertido->value,
                        ]);
                    }),
                Action::make('discard')
                    ->label('Descartar')
                    ->color('danger')
                    ->icon('heroicon-o-x-circle')
                    ->requiresConfirmation()
                    ->action(function (Lead $record): void {
                        $previousValue = $record->estado instanceof LeadStatus
                            ? $record->estado->value
                            : $record->estado;

                        if ($previousValue === LeadStatus::Descartado->value) {
                            return;
                        }

                        $record->update([
                            'estado' => LeadStatus::Descartado->value,
                        ]);

                        EventoAuditoria::create([
                            'lead_id' => $record->getKey(),
                            'usuario_id' => auth()->id(),
                            'accion' => 'cambio_estado',
                            'campo' => 'estado',
                            'valor_anterior' => $previousValue,
                            'valor_nuevo' => LeadStatus::Descartado->value,
                        ]);
                    }),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated()
            ->filters([
                SelectFilter::make('archivado')
                    ->label('Archivo')
                    ->options([
                        'active' => 'Activas',
                        'archived' => 'Archivadas',
                        'all' => 'Todas',
                    ])
                    ->default('active')
                    ->query(function (Builder $query, array $data): Builder {
                        return match ($data['value'] ?? 'active') {
                            'archived' => $query->where('archivado', true),
                            'all' => $query,
                            default => $query->where('archivado', false),
                        };
                    }),
                SelectFilter::make('estado')
                    ->label('Estado')
                    ->options(array_column(LeadStatus::cases(), 'value', 'value')),
                SelectFilter::make('tipo_necesidad')
                    ->label('Tipo de necesidad')
                    ->options(array_column(TipoNecesidad::cases(), 'value', 'value')),
                Filter::make('search')
                    ->label('Búsqueda')
                    ->form([
                        TextInput::make('value')->label('Buscar'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        if (! filled($data['value'])) {
                            return $query;
                        }

                        $term = $data['value'];

                        return $query->where(function (Builder $q) use ($term): Builder {
                            return $q->where('nombre', 'like', "%{$term}%")
                                ->orWhere('email', 'like', "%{$term}%")
                                ->orWhere('empresa', 'like', "%{$term}%")
                                ->orWhere('telefono', 'like', "%{$term}%")
                                ->orWhere('mensaje', 'like', "%{$term}%");
                        });
                    }),
                Filter::make('created_at')
                    ->label('Fecha de creación')
                    ->form([
                        DatePicker::make('created_from')
                            ->label('Desde'),
                        DatePicker::make('created_until')
                            ->label('Hasta'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $q, $date): Builder => $q->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $q, $date): Builder => $q->whereDate('created_at', '<=', $date),
                            );
                    }),
                SelectFilter::make('responsable_id')
                    ->label('Responsable')
                    ->relationship('responsable', 'name'),
            ]);
    }

    public static function archiveLead(Lead $record): null
    {
        if ($record->archivado) {
            return null;
        }

        $record->update(['archivado' => true]);
        static::recordArchiveEvent($record, 'archivado', 'false', 'true');

        return null;
    }

    public static function restoreLead(Lead $record): null
    {
        if (! $record->archivado) {
            return null;
        }

        $record->update(['archivado' => false]);
        static::recordArchiveEvent($record, 'restaurado', 'true', 'false');

        return null;
    }

    public static function deleteLead(Lead $record): null
    {
        if (! static::canDeleteLead($record)) {
            return null;
        }

        EventoAuditoria::create([
            'lead_id' => $record->getKey(),
            'usuario_id' => auth()->id(),
            'accion' => 'eliminado',
            'campo' => 'registro',
            'valor_anterior' => (string) $record->getKey(),
            'valor_nuevo' => null,
        ]);

        $record->delete();

        return null;
    }

    public static function canDeleteLead(Lead $record): bool
    {
        $user = auth()->user();

        return $record->archivado
            && $user instanceof User
            && $user->activo
            && $user->rol === 'admin';
    }

    private static function recordArchiveEvent(Lead $record, string $action, string $previousValue, string $nextValue): void
    {
        EventoAuditoria::create([
            'lead_id' => $record->getKey(),
            'usuario_id' => auth()->id(),
            'accion' => $action,
            'campo' => 'archivado',
            'valor_anterior' => $previousValue,
            'valor_nuevo' => $nextValue,
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLeads::route('/'),
            'view' => ViewLead::route('/{record}'),
        ];
    }
}
