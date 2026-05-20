import { OpenAPIHono } from '@hono/zod-openapi'
import { zValidator } from '@hono/zod-validator'
import { z } from '@hono/zod-openapi'
import { createIncidentSchema } from './incidents.schema'
import { requireAuth } from '../../shared/middleware/auth.middleware'
import { success } from '../../shared/api-response'
import * as incidentsService from './incidents.service'

const incidentsRoutes = new OpenAPIHono()

incidentsRoutes.post('/', requireAuth, zValidator('json', createIncidentSchema), async (c) => {
  const input = c.req.valid('json')
  const payload = c.get('jwtPayload') as { id: number }

  const incident = await incidentsService.createIncident({
    ...input,
    createdBy: payload.id,
  })

  return success(c, { incident }, 201)
})

const listQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  status: z.string().optional(),
  priority: z.string().optional(),
})

incidentsRoutes.get('/', requireAuth, zValidator('query', listQuerySchema), async (c) => {
  const query = c.req.valid('query')
  const payload = c.get('jwtPayload') as { id: number }

  const result = await incidentsService.listUserIncidents(payload.id, {
    page: query.page,
    limit: query.limit,
    status: query.status,
    priority: query.priority,
  })

  return c.json({
    data: result.data,
    pagination: result.pagination,
  })
})

incidentsRoutes.get('/:id', requireAuth, async (c) => {
  const id = Number(c.req.param('id'))
  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid incident id' }, 400)
  }

  const payload = c.get('jwtPayload') as { id: number }
  const result = await incidentsService.getIncidentDetail(id, payload.id)

  return success(c, result)
})

export { incidentsRoutes }
