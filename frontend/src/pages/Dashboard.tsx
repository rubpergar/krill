import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Monitor,
  Plus,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';

const STATUS_LABELS: Record<string, string> = {
  open: 'Abierta',
  in_progress: 'En progreso',
  resolved: 'Resuelta',
  closed: 'Cerrada',
};

const STATUS_ICONS: Record<string, typeof AlertTriangle> = {
  open: AlertTriangle,
  in_progress: Clock,
  resolved: CheckCircle2,
  closed: XCircle,
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-neutral-600',
  medium: 'bg-yellow-600',
  high: 'bg-orange-600',
  critical: 'bg-red-600',
};

function StatusBadge({ status }: { status: string }) {
  const Icon = STATUS_ICONS[status] ?? AlertTriangle;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-elevated px-2.5 py-0.5 text-xs text-muted-foreground">
      <Icon className="size-3" />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  return (
    <span
      className={`inline-block size-2 rounded-full ${PRIORITY_COLORS[priority] ?? 'bg-neutral-600'}`}
    />
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<api.Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getIncidents({ limit: '100' })
      .then((data) => setIncidents(data.incidents))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Error al cargar'),
      )
      .finally(() => setLoading(false));
  }, []);

  const total = incidents.length;
  const counts = {
    open: incidents.filter((i) => i.status === 'open').length,
    in_progress: incidents.filter((i) => i.status === 'in_progress').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
    closed: incidents.filter((i) => i.status === 'closed').length,
  };

  const recent = incidents.slice(-5).reverse();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-neutral-100">
          Bienvenido, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Panel de incidencias del espacio de coworking
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Abiertas"
          value={counts.open}
          icon={AlertTriangle}
          color="text-yellow-400"
        />
        <StatCard
          label="En progreso"
          value={counts.in_progress}
          icon={Clock}
          color="text-blue-400"
        />
        <StatCard
          label="Resueltas"
          value={counts.resolved}
          icon={CheckCircle2}
          color="text-green-400"
        />
        <StatCard
          label="Totales"
          value={total}
          icon={Monitor}
          color="text-primary"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-bento border border-border bg-surface-card p-5">
            <h2 className="mb-4 text-sm font-medium text-neutral-100">
              Incidencias recientes
            </h2>

            {loading && (
              <div className="flex justify-center py-8">
                <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {error && (
              <p className="py-8 text-center text-sm text-red-400">{error}</p>
            )}

            {!loading && !error && recent.length === 0 && (
              <div className="py-8 text-center">
                <Monitor className="mx-auto size-8 text-muted" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No hay incidencias todavía
                </p>
                <Link
                  to="#"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Crear la primera incidencia
                </Link>
              </div>
            )}

            {!loading && recent.length > 0 && (
              <div className="space-y-2">
                {recent.map((inc) => (
                  <div
                    key={inc.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-4 py-3 transition-colors hover:bg-surface-hover"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-neutral-100">
                        {inc.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(inc.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      <PriorityDot priority={inc.priority} />
                      <StatusBadge status={inc.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="#"
            className="flex items-center gap-3 rounded-bento border border-border bg-surface-card p-5 transition-colors hover:bg-surface-hover"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-100">
                Nueva incidencia
              </p>
              <p className="text-xs text-muted-foreground">
                Reportar un problema
              </p>
            </div>
          </Link>

          <div className="rounded-bento border border-border bg-surface-card p-5">
            <h2 className="mb-3 text-sm font-medium text-neutral-100">
              Resumen rápido
            </h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {total > 0 && (
                <p>
                  <span className="text-neutral-100">{counts.open}</span>{' '}
                  abierta{counts.open !== 1 ? 's' : ''} de{' '}
                  <span className="text-neutral-100">{total}</span> total
                  {total !== 1 ? 'es' : ''}
                </p>
              )}
              {counts.in_progress > 0 && (
                <p>
                  <span className="text-neutral-100">{counts.in_progress}</span>{' '}
                  en progreso
                </p>
              )}
              {counts.resolved > 0 && (
                <p>
                  <span className="text-neutral-100">{counts.resolved}</span>{' '}
                  resuelta{counts.resolved !== 1 ? 's' : ''}
                </p>
              )}
              {total === 0 && <p>Sin incidencias registradas</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof AlertTriangle;
  color: string;
}) {
  return (
    <div className="rounded-bento border border-border bg-surface-card p-5 transition-colors hover:bg-surface-hover">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className={`size-5 ${color}`} />
      </div>
      <p className="mt-2 text-2xl font-semibold text-neutral-100">{value}</p>
    </div>
  );
}
