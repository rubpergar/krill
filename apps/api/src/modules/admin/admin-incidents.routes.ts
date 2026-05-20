import { OpenAPIHono, z } from '@hono/zod-openapi'
import { zValidator } from '@hono/zod-validator'
import { requireAuth, requireRole } from '../../shared/middleware/auth.middleware'
import { success } from '../../shared/api-response'
import { statusEnum, priorityEnum } from '../incidents/incidents.schema'
import * as adminIncidentsService from './admin-incidents.service'

const adminIncidentsRoutes = new OpenAPIHono()

adminIncidentsRoutes.use('/*', requireAuth, requireRole('admin'))

const listQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  status: z.string().optional(),
  priority: z.string().optional(),
  created_by: z.coerce.number().optional(),
})

adminIncidentsRoutes.get('/', zValidator('query', listQuerySchema), async (c) => {
  const query = c.req.valid('query')

  const result = await adminIncidentsService.listAllIncidents({
    page: query.page,
    limit: query.limit,
    status: query.status,
    priority: query.priority,
    createdBy: query.created_by,
  })

  return c.json({ data: result.data, pagination: result.pagination })
})

adminIncidentsRoutes.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid incident id' }, 400)
  }

  const result = await adminIncidentsService.getAdminIncidentDetail(id)
  return success(c, result)
})

const updateStatusSchema = z.object({
  status: statusEnum,
})

adminIncidentsRoutes.patch('/:id/status', zValidator('json', updateStatusSchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid incident id' }, 400)
  }

  const { status } = c.req.valid('json')
  const result = await adminIncidentsService.updateStatus(id, status)
  return success(c, result)
})

const updatePrioritySchema = z.object({
  priority: priorityEnum,
})

adminIncidentsRoutes.patch('/:id/priority', zValidator('json', updatePrioritySchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid incident id' }, 400)
  }

  const { priority } = c.req.valid('json')
  const result = await adminIncidentsService.updatePriority(id, priority)
  return success(c, result)
})

const assignSchema = z.object({
  assignedTo: z.number().optional().nullable(),
})

adminIncidentsRoutes.patch('/:id/assign', zValidator('json', assignSchema), async (c) => {
  const id = Number(c.req.param('id'))
  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid incident id' }, 400)
  }

  const payload = c.get('jwtPayload') as { id: number }
  const { assignedTo } = c.req.valid('json')

  const targetUser = assignedTo === undefined ? payload.id : assignedTo
  const result = await adminIncidentsService.assignIncident(id, targetUser)
  return success(c, result)
})

export { adminIncidentsRoutes }
