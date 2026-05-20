import { OpenAPIHono } from '@hono/zod-openapi'
import { registerSchema, loginSchema, refreshSchema } from './auth.schema'
import { requireAuth } from '../../shared/middleware/auth.middleware'
import { zValidator } from '@hono/zod-validator'
import { success } from '../../shared/api-response'
import * as authService from './auth.service'

const authRoutes = new OpenAPIHono()

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const input = c.req.valid('json')
  const result = await authService.register(input)
  return success(c, result, 201)
})

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const input = c.req.valid('json')
  const result = await authService.login(input)
  return success(c, result)
})

authRoutes.get('/me', requireAuth, async (c) => {
  const payload = c.get('jwtPayload') as { id: number; email: string; role: string }
  const result = await authService.getMe(payload.id)
  return success(c, result)
})

authRoutes.post('/refresh', zValidator('json', refreshSchema), async (c) => {
  const { refreshToken } = c.req.valid('json')
  const result = await authService.refresh(refreshToken)
  return success(c, result)
})

authRoutes.post('/logout', zValidator('json', refreshSchema), async (c) => {
  const { refreshToken } = c.req.valid('json')
  await authService.logout(refreshToken)
  return c.body(null, 204)
})

export { authRoutes }
