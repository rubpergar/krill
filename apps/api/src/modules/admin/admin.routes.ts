import { OpenAPIHono } from '@hono/zod-openapi'
import { requireAuth, requireRole } from '../../shared/middleware/auth.middleware'
import { success } from '../../shared/api-response'
import * as authService from '../auth/auth.service'

const adminRoutes = new OpenAPIHono()

adminRoutes.get('/me', requireAuth, requireRole('admin'), async (c) => {
  const payload = c.get('jwtPayload') as { id: number }
  const result = await authService.getMe(payload.id)
  return success(c, result)
})

export { adminRoutes }
