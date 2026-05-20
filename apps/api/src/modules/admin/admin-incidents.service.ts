import { eq } from 'drizzle-orm'
import { getDatabase } from '../../db/index'
import { httpError } from '../../shared/errors/http-error'
import { users } from '../../db/schema'
import * as incidentsRepository from '../incidents/incidents.repository'

function sanitizeIncident(incident: incidentsRepository.IncidentRow) {
  return {
    id: incident.id,
    title: incident.title,
    description: incident.description,
    status: incident.status,
    priority: incident.priority,
    created_by: incident.createdBy,
    assigned_to: incident.assignedTo,
    created_at: incident.createdAt,
    updated_at: incident.updatedAt,
  }
}

export async function listAllIncidents(
  options: { page: number; limit: number; status?: string; priority?: string; createdBy?: number },
) {
  const db = getDatabase()

  const safePage = Math.max(1, options.page)
  const safeLimit = Math.min(100, Math.max(1, options.limit))

  const { data, total } = incidentsRepository.findAllIncidents(db, {
    page: safePage,
    limit: safeLimit,
    status: options.status,
    priority: options.priority,
    createdBy: options.createdBy,
  })

  return {
    data: data.map(sanitizeIncident),
    pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) },
  }
}

export async function getAdminIncidentDetail(incidentId: number) {
  const db = getDatabase()

  const incident = incidentsRepository.findIncidentById(db, incidentId)
  if (!incident) {
    httpError(404, 'Incident not found')
  }

  return { incident: sanitizeIncident(incident) }
}

export async function updateStatus(incidentId: number, status: string) {
  const db = getDatabase()

  const incident = incidentsRepository.findIncidentById(db, incidentId)
  if (!incident) {
    httpError(404, 'Incident not found')
  }

  incidentsRepository.updateIncidentStatus(db, incidentId, status)

  const updated = incidentsRepository.findIncidentById(db, incidentId)!
  return { incident: sanitizeIncident(updated) }
}

export async function updatePriority(incidentId: number, priority: string) {
  const db = getDatabase()

  const incident = incidentsRepository.findIncidentById(db, incidentId)
  if (!incident) {
    httpError(404, 'Incident not found')
  }

  incidentsRepository.updateIncidentPriority(db, incidentId, priority)

  const updated = incidentsRepository.findIncidentById(db, incidentId)!
  return { incident: sanitizeIncident(updated) }
}

export async function assignIncident(incidentId: number, assignedTo: number | null) {
  const db = getDatabase()

  const incident = incidentsRepository.findIncidentById(db, incidentId)
  if (!incident) {
    httpError(404, 'Incident not found')
  }

  if (assignedTo !== null) {
    const user = db.select().from(users).where(eq(users.id, assignedTo)).get()
    if (!user) {
      httpError(404, 'User not found')
    }
  }

  incidentsRepository.assignIncident(db, incidentId, assignedTo)

  const updated = incidentsRepository.findIncidentById(db, incidentId)!
  return { incident: sanitizeIncident(updated) }
}
