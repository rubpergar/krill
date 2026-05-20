import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { BentoGrid } from '../components/layout/BentoGrid'
import { CardSkeleton, TableSkeleton } from '../components/ui/Skeleton'
import { useAdminIncidents } from '../hooks/useAdminIncidents'
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

export function AdminDashboardPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('')
  const { data, isLoading, error } = useAdminIncidents(page, statusFilter, priorityFilter)

  const incidents = data?.data ?? []
  const pagination = data?.pagination

  const total = pagination?.total ?? 0
  const openCount = incidents.filter((i) => i.status === 'open').length
  const inProgressCount = incidents.filter((i) => i.status === 'in_progress').length
  const resolvedCount = incidents.filter((i) => i.status === 'resolved').length

  const kpiCards = [
    { label: 'Total', value: total, color: 'text-neutral-900' },
    { label: 'Abiertas', value: openCount, color: 'text-blue-600' },
    { label: 'En progreso', value: inProgressCount, color: 'text-amber-600' },
    { label: 'Resueltas', value: resolvedCount, color: 'text-green-600' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Panel de administración</h1>
        <p className="text-sm text-neutral-500">Gestión global de incidencias</p>
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
          <h2 className="text-lg font-semibold text-neutral-900">Todas las incidencias</h2>
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
          <Card><p className="text-neutral-500">No hay incidencias registradas.</p></Card>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-neutral-600">Título</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Creador</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Prioridad</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Asignado</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {incidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{inc.title}</td>
                      <td className="px-4 py-3 text-neutral-500">{inc.created_by}</td>
                      <td className="px-4 py-3"><Badge variant={inc.status}>{statusLabels[inc.status] ?? inc.status}</Badge></td>
                      <td className="px-4 py-3"><Badge variant={inc.priority}>{priorityLabels[inc.priority] ?? inc.priority}</Badge></td>
                      <td className="px-4 py-3 text-neutral-500">{inc.assigned_to || '-'}</td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/incidents/${inc.id}`} className="text-blue-600 hover:underline">
                          Gestionar
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
