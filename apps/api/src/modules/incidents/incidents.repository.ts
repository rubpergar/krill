import { eq, and, desc, sql } from 'drizzle-orm'
import type { DB } from '../../shared/types'
import { incidents } from '../../db/schema'

export type IncidentRow = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  createdBy: number
  assignedTo: number | null
  createdAt: string
  updatedAt: string
}

export function createIncident(
  db: DB,
  input: {
    title: string
    description: string
    priority: string
    createdBy: number
  },
) {
  const now = new Date().toISOString()
  const result = db.insert(incidents).values({
    title: input.title,
    description: input.description,
    priority: input.priority,
    createdBy: input.createdBy,
    createdAt: now,
    updatedAt: now,
  }).returning().get()
  return result as unknown as IncidentRow
}

export function findIncidentById(db: DB, id: number) {
  const result = db.select().from(incidents).where(eq(incidents.id, id)).get()
  return result as unknown as IncidentRow | undefined
}

export function findIncidentsByUserId(
  db: DB,
  userId: number,
  options: { page: number; limit: number; status?: string; priority?: string },
) {
  const conditions = [eq(incidents.createdBy, userId)]
  if (options.status) conditions.push(eq(incidents.status, options.status))
  if (options.priority) conditions.push(eq(incidents.priority, options.priority))

  const where = and(...conditions)

  const results = db.select()
    .from(incidents)
    .where(where)
    .orderBy(desc(incidents.createdAt))
    .limit(options.limit)
    .offset((options.page - 1) * options.limit)
    .all()

  const countResult = db.select({ count: sql<number>`count(*)` })
    .from(incidents)
    .where(where)
    .get()

  return {
    data: results as unknown as IncidentRow[],
    total: countResult?.count ?? 0,
  }
}

export function findAllIncidents(
  db: DB,
  options: { page: number; limit: number; status?: string; priority?: string; createdBy?: number },
) {
  const conditions: ReturnType<typeof eq>[] = []
  if (options.status) conditions.push(eq(incidents.status, options.status))
  if (options.priority) conditions.push(eq(incidents.priority, options.priority))
  if (options.createdBy) conditions.push(eq(incidents.createdBy, options.createdBy))

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const results = db.select()
    .from(incidents)
    .where(where)
    .orderBy(desc(incidents.createdAt))
    .limit(options.limit)
    .offset((options.page - 1) * options.limit)
    .all()

  const countResult = db.select({ count: sql<number>`count(*)` })
    .from(incidents)
    .where(where)
    .get()

  return {
    data: results as unknown as IncidentRow[],
    total: countResult?.count ?? 0,
  }
}

export function updateIncidentStatus(db: DB, id: number, status: string) {
  const now = new Date().toISOString()
  db.update(incidents).set({ status, updatedAt: now }).where(eq(incidents.id, id)).run()
}

export function updateIncidentPriority(db: DB, id: number, priority: string) {
  const now = new Date().toISOString()
  db.update(incidents).set({ priority, updatedAt: now }).where(eq(incidents.id, id)).run()
}

export function assignIncident(db: DB, id: number, assignedTo: number | null) {
  const now = new Date().toISOString()
  db.update(incidents).set({ assignedTo, updatedAt: now }).where(eq(incidents.id, id)).run()
}
