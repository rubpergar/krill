import { z } from '@hono/zod-openapi'

export const priorityEnum = z.enum(['low', 'medium', 'high', 'critical'])
export const statusEnum = z.enum(['open', 'in_progress', 'resolved', 'closed'])

export const createIncidentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  priority: priorityEnum.optional().default('medium'),
})

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>
