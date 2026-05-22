<?php

namespace App\Filament\Resources;

use App\Enums\LeadStatus;
use App\Enums\TipoNecesidad;
use App\Filament\Resources\LeadResource\Pages\ListLeads;
use App\Models\Lead;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
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
                    ->label('Tipo de necesidad'),
                TextColumn::make('estado')
                    ->label('Estado'),
                TextColumn::make('responsable.name')
                    ->label('Responsable')
                    ->placeholder('—'),
                TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->paginated()
            ->filters([
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

    public static function getPages(): array
    {
        return [
            'index' => ListLeads::route('/'),
        ];
    }
}
