import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { BentoGrid } from '../components/layout/BentoGrid'
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton'
import { useAuth } from '../hooks/useAuth'
import { useIncidents } from '../hooks/useIncidents'
import type { StatusFilter, PriorityFilter } from '../types'

const statusLabels: Record<string, string> = {
  open: 'Abiertas',
  in_progress: 'En progreso',
  resolved: 'Resueltas',
  closed: 'Cerradas',
}

const priorityLabels: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
}

export function DashboardPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('')
  const { data, isLoading, error } = useIncidents(page, statusFilter, priorityFilter)

  const incidents = data?.data ?? []
  const pagination = data?.pagination

  const kpiCards = [
    { label: 'Total', value: pagination?.total ?? '-', color: 'text-neutral-900' },
    { label: 'Abiertas', value: incidents.filter((i) => i.status === 'open').length, color: 'text-blue-600' },
    { label: 'En progreso', value: incidents.filter((i) => i.status === 'in_progress').length, color: 'text-amber-600' },
    { label: 'Resueltas', value: incidents.filter((i) => i.status === 'resolved').length, color: 'text-green-600' },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500">Bienvenido, {user?.name}</p>
        </div>
        <Link to="/incidents/new">
          <Button>Nueva incidencia</Button>
        </Link>
      </div>

      {isLoading ? (
        <BentoGrid>
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </BentoGrid>
      ) : (
        <BentoGrid>
          {kpiCards.map((kpi) => (
            <Card key={kpi.label}>
              <p className="text-sm text-neutral-500">{kpi.label}</p>
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </Card>
          ))}
        </BentoGrid>
      )}

      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-neutral-900">Incidencias</h2>
          <select
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1) }}
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value as PriorityFilter); setPage(1) }}
          >
            <option value="">Todas las prioridades</option>
            {Object.entries(priorityLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <Card><p className="text-red-600">Error al cargar incidencias</p></Card>
        ) : incidents.length === 0 ? (
          <Card>
            <p className="text-neutral-500">No tienes incidencias aún.</p>
            <Link to="/incidents/new" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
              Crear primera incidencia
            </Link>
          </Card>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-neutral-600">Título</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Prioridad</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Creado</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {incidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{inc.title}</td>
                      <td className="px-4 py-3"><Badge variant={inc.status}>{statusLabels[inc.status] ?? inc.status}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={inc.priority}>{priorityLabels[inc.priority] ?? inc.priority}</Badge></td>
                      <td className="px-4 py-3 text-neutral-500">{new Date(inc.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Link to={`/incidents/${inc.id}`} className="text-blue-600 hover:underline">
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  Página {pagination.page} de {pagination.totalPages} ({pagination.total} incidencias)
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                    Anterior
                  </Button>
                  <Button variant="secondary" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
