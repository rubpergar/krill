import { getDatabase } from '../../db/index'
import { httpError } from '../../shared/errors/http-error'
import * as incidentsRepository from './incidents.repository'
import type { CreateIncidentInput } from './incidents.schema'

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

export async function createIncident(input: CreateIncidentInput & { createdBy: number }) {
  const db = getDatabase()

  const incident = incidentsRepository.createIncident(db, {
    title: input.title,
    description: input.description,
    priority: input.priority,
    createdBy: input.createdBy,
  })

  return sanitizeIncident(incident)
}

export async function listUserIncidents(
  userId: number,
  options: { page: number; limit: number; status?: string; priority?: string },
) {
  const db = getDatabase()

  const safePage = Math.max(1, options.page)
  const safeLimit = Math.min(100, Math.max(1, options.limit))

  const { data, total } = incidentsRepository.findIncidentsByUserId(db, userId, {
    page: safePage,
    limit: safeLimit,
    status: options.status,
    priority: options.priority,
  })

  const totalPages = Math.ceil(total / safeLimit)

  return {
    data: data.map(sanitizeIncident),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  }
}

export async function getIncidentDetail(incidentId: number, userId: number) {
  const db = getDatabase()

  const incident = incidentsRepository.findIncidentById(db, incidentId)
  if (!incident || incident.createdBy !== userId) {
    httpError(404, 'Incident not found')
  }

  return { incident: sanitizeIncident(incident) }
}
