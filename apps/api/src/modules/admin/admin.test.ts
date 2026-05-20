import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { eq } from 'drizzle-orm'
import { HttpError } from '../../shared/errors/http-error'
import { HTTPException } from 'hono/http-exception'
import { connectDatabase, closeDatabase } from '../../db/index'
import { users } from '../../db/schema'
import { authRoutes } from '../auth/auth.routes'
import { adminRoutes } from './admin.routes'

function createApp() {
  const app = new OpenAPIHono()

  app.onError((err, c) => {
    if (err instanceof HttpError) {
      return c.json({ error: err.message }, err.statusCode as ContentfulStatusCode)
    }
    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status as ContentfulStatusCode)
    }
    return c.json({ error: 'Internal server error' }, 500)
  })

  app.route('/api/v1/auth', authRoutes)
  app.route('/api/v1/admin', adminRoutes)

  return app
}

async function registerAndLogin(app: ReturnType<typeof createApp>, email: string, name: string) {
  await app.request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', name }),
  })
  const loginRes = await app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }),
  })
  const body = await loginRes.json() as { data: { accessToken: string } }
  return body.data.accessToken
}

beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  connectDatabase(':memory:')
})

afterEach(() => {
  closeDatabase()
  delete process.env.JWT_SECRET
})

describe('GET /api/v1/admin/me', () => {
  it('returns 200 for admin user', async () => {
    const app = createApp()

    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'password123', name: 'Admin' }),
    })

    // Manually promote user to admin via DB
    const db = await import('../../db/index').then(m => m.getDatabase())
    db.update(users).set({ role: 'admin' }).where(eq(users.email, 'admin@test.com')).run()

    // Login after promotion to get a token with admin role
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'password123' }),
    })
    const loginBody = await loginRes.json() as { data: { accessToken: string } }
    const token = loginBody.data.accessToken

    const res = await app.request('/api/v1/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { data: { user: { email: string; role: string } } }
    expect(body.data.user.role).toBe('admin')
  })

  it('returns 403 for regular user', async () => {
    const app = createApp()
    const token = await registerAndLogin(app, 'user@test.com', 'Regular User')

    const res = await app.request('/api/v1/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(403)
  })

  it('returns 401 without token', async () => {
    const app = createApp()
    const res = await app.request('/api/v1/admin/me')
    expect(res.status).toBe(401)
  })
})
