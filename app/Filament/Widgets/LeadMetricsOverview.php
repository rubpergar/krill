<?php

namespace App\Filament\Widgets;

use App\Enums\LeadStatus;
use App\Models\Lead;
use Filament\Widgets\StatsOverviewWidget;

class LeadMetricsOverview extends StatsOverviewWidget
{
    protected static bool $isLazy = false;

    protected function getStats(): array
    {
        return [
            StatsOverviewWidget\Stat::make('Total de leads', Lead::query()->count())
                ->color('primary'),
            StatsOverviewWidget\Stat::make('Nuevos', Lead::query()->where('estado', LeadStatus::Nuevo->value)->count())
                ->color('info'),
            StatsOverviewWidget\Stat::make('Activos', Lead::query()->whereIn('estado', [
                LeadStatus::Revisado->value,
                LeadStatus::Contactado->value,
                LeadStatus::EnSeguimiento->value,
            ])->count())
                ->color('warning'),
            StatsOverviewWidget\Stat::make('Convertidos', Lead::query()->where('estado', LeadStatus::Convertido->value)->count())
                ->color('success'),
            StatsOverviewWidget\Stat::make('Descartados', Lead::query()->where('estado', LeadStatus::Descartado->value)->count())
                ->color('danger'),
            StatsOverviewWidget\Stat::make('Sin responsable', Lead::query()->whereNull('responsable_id')->count())
                ->color('gray'),
        ];
    }
}
