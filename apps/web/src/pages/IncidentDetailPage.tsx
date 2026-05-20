import { useParams, Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useIncident } from '../hooks/useIncidents'

const statusLabels: Record<string, string> = {
  open: 'Abierta',
  in_progress: 'En progreso',
  resolved: 'Resuelta',
  closed: 'Cerrada',
}

const priorityLabels: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
}

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useIncident(id!)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <CardSkeleton />
      </div>
    )
  }

  if (error || !data?.data.incident) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card>
          <p className="text-red-600">Incidencia no encontrada</p>
          <Link to="/dashboard">
            <Button variant="secondary" className="mt-4">Volver al dashboard</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const incident = data.data.incident

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/dashboard" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
        &larr; Volver al dashboard
      </Link>
      <Card>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-neutral-900">{incident.title}</h1>
          <div className="flex gap-2">
            <Badge variant={incident.status}>{statusLabels[incident.status] ?? incident.status}</Badge>
            <Badge variant={incident.priority}>{priorityLabels[incident.priority] ?? incident.priority}</Badge>
          </div>
        </div>
        <p className="mb-6 whitespace-pre-wrap text-neutral-700">{incident.description}</p>
        <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4 text-sm">
          <div>
            <p className="text-neutral-500">Creado</p>
            <p className="font-medium text-neutral-900">{new Date(incident.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-neutral-500">Actualizado</p>
            <p className="font-medium text-neutral-900">{new Date(incident.updated_at).toLocaleString()}</p>
          </div>
          {incident.assigned_to && (
            <div>
              <p className="text-neutral-500">Asignado a</p>
              <p className="font-medium text-neutral-900">{incident.assigned_to}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
