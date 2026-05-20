import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { useAdminIncident, useUpdateIncidentStatus, useUpdateIncidentPriority, useAssignIncident } from '../hooks/useAdminIncidents'
import { useToast } from '../hooks/useToast'

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

export function AdminIncidentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useAdminIncident(id!)
  const updateStatus = useUpdateIncidentStatus()
  const updatePriority = useUpdateIncidentPriority()
  const assign = useAssignIncident()
  const { addToast } = useToast()
  const [assignInput, setAssignInput] = useState('')

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
          <Link to="/admin">
            <Button variant="secondary" className="mt-4">Volver al panel</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const incident = data.data.incident

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatus.mutateAsync({ id: incident.id, status })
      addToast('Estado actualizado', 'success')
    } catch {
      addToast('Error al actualizar estado', 'error')
    }
  }

  const handlePriorityChange = async (priority: string) => {
    try {
      await updatePriority.mutateAsync({ id: incident.id, priority })
      addToast('Prioridad actualizada', 'success')
    } catch {
      addToast('Error al actualizar prioridad', 'error')
    }
  }

  const handleAssign = async () => {
    try {
      await assign.mutateAsync({ id: incident.id, assignedTo: assignInput || undefined })
      addToast('Incidencia asignada', 'success')
      setAssignInput('')
    } catch {
      addToast('Error al asignar', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin" className="mb-4 inline-block text-sm text-blue-600 hover:underline">
        &larr; Volver al panel
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
            <p className="text-neutral-500">Creado por</p>
            <p className="font-medium text-neutral-900">{incident.created_by}</p>
          </div>
          <div>
            <p className="text-neutral-500">Asignado a</p>
            <p className="font-medium text-neutral-900">{incident.assigned_to || 'Sin asignar'}</p>
          </div>
          <div>
            <p className="text-neutral-500">Creado</p>
            <p className="font-medium text-neutral-900">{new Date(incident.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-neutral-500">Actualizado</p>
            <p className="font-medium text-neutral-900">{new Date(incident.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Estado</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusLabels).map(([k, v]) => (
              <Button
                key={k}
                variant={k === incident.status ? 'primary' : 'secondary'}
                size="sm"
                loading={updateStatus.isPending}
                onClick={() => handleStatusChange(k)}
              >
                {v}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Prioridad</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(priorityLabels).map(([k, v]) => (
              <Button
                key={k}
                variant={k === incident.priority ? 'primary' : 'secondary'}
                size="sm"
                loading={updatePriority.isPending}
                onClick={() => handlePriorityChange(k)}
              >
                {v}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-neutral-900">Asignar</h3>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ID o email"
              value={assignInput}
              onChange={(e) => setAssignInput(e.target.value)}
            />
            <Button
              size="sm"
              loading={assign.isPending}
              onClick={handleAssign}
            >
              Asignar
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
