import type { Context, Next } from 'hono'
import { jwt } from 'hono/jwt'

export type UserPayload = {
  id: number
  email: string
  role: string
}

function getSecret() {
  return process.env.JWT_SECRET || 'dev-secret-change-in-production'
}

export async function requireAuth(c: Context, next: Next) {
  const jwtMiddleware = jwt({ secret: getSecret(), alg: 'HS256' })
  await jwtMiddleware(c, next)
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const payload = c.get('jwtPayload') as UserPayload | undefined
    if (!payload) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    if (!roles.includes(payload.role)) {
      return c.json({ error: 'Forbidden: insufficient permissions' }, 403)
    }
    await next()
  }
}
