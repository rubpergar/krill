import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { eq } from 'drizzle-orm'
import { HttpError } from '../../shared/errors/http-error'
import { HTTPException } from 'hono/http-exception'
import { connectDatabase, closeDatabase, getDatabase } from '../../db/index'
import { users } from '../../db/schema'
import { adminIncidentsRoutes } from './admin-incidents.routes'
import { authRoutes } from '../auth/auth.routes'
import { incidentsRoutes } from '../incidents/incidents.routes'

type LoginResult = { accessToken: string; refreshToken: string; user: { id: number } }
type JsonRes = { data?: Record<string, unknown>; error?: string }

function createTestApp() {
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
  app.route('/api/v1/incidents', incidentsRoutes)
  app.route('/api/v1/admin/incidents', adminIncidentsRoutes)

  return app
}

async function register(app: ReturnType<typeof createTestApp>, email: string, name: string) {
  await app.request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', name }),
  })
}

async function login(app: ReturnType<typeof createTestApp>, email: string) {
  const loginRes = await app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }),
  })
  const body = await loginRes.json() as JsonRes
  return body.data as unknown as LoginResult
}

async function promoteToAdmin(email: string) {
  const db = getDatabase()
  db.update(users).set({ role: 'admin' }).where(eq(users.email, email)).run()
}

async function createIncidentViaApi(app: ReturnType<typeof createTestApp>, token: string, title: string) {
  const res = await app.request('/api/v1/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, description: 'Desc' }),
  })
  const body = await res.json() as JsonRes
  return (body.data as Record<string, unknown>).incident as Record<string, unknown>
}

beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  connectDatabase(':memory:')
})

afterEach(() => {
  closeDatabase()
  delete process.env.JWT_SECRET
})

describe('Admin Incidents API', () => {
  describe('GET /api/v1/admin/incidents', () => {
    it('returns 200 with all incidents for admin', async () => {
      const app = createTestApp()
      await register(app, 'admin@test.com', 'Admin')
      await promoteToAdmin('admin@test.com')
      const admin = await login(app, 'admin@test.com')

      await createIncidentViaApi(app, admin.accessToken, 'Incident 1')
      await createIncidentViaApi(app, admin.accessToken, 'Incident 2')

      const res = await app.request('/api/v1/admin/incidents', {
        headers: { Authorization: `Bearer ${admin.accessToken}` },
      })
      expect(res.status).toBe(200)
      const body = await res.json() as JsonRes
      const list = body.data as unknown as Array<Record<string, unknown>>
      expect(list.length).toBeGreaterThanOrEqual(2)
    })

    it('returns 403 for regular user', async () => {
      const app = createTestApp()
      await register(app, 'user@test.com', 'User')
      const user = await login(app, 'user@test.com')

      const res = await app.request('/api/v1/admin/incidents', {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      expect(res.status).toBe(403)
    })

    it('returns 401 without token', async () => {
      const app = createTestApp()
      const res = await app.request('/api/v1/admin/incidents')
      expect(res.status).toBe(401)
    })
  })

  describe('GET /api/v1/admin/incidents/:id', () => {
    it('returns 200 with incident detail for admin', async () => {
      const app = createTestApp()
      await register(app, 'admin@test.com', 'Admin')
      await promoteToAdmin('admin@test.com')
      const admin = await login(app, 'admin@test.com')

      const created = await createIncidentViaApi(app, admin.accessToken, 'Detail test')

      const res = await app.request(`/api/v1/admin/incidents/${created.id}`, {
        headers: { Authorization: `Bearer ${admin.accessToken}` },
      })
      expect(res.status).toBe(200)
    })

    it('returns 404 for non-existent id', async () => {
      const app = createTestApp()
      await register(app, 'admin@test.com', 'Admin')
      await promoteToAdmin('admin@test.com')
      const admin = await login(app, 'admin@test.com')

      const res = await app.request('/api/v1/admin/incidents/99999', {
        headers: { Authorization: `Bearer ${admin.accessToken}` },
      })
      expect(res.status).toBe(404)
    })
  })

  describe('PATCH /api/v1/admin/incidents/:id/status', () => {
    async function setup() {
      const app = createTestApp()
      await register(app, 'admin@test.com', 'Admin')
      await promoteToAdmin('admin@test.com')
      const admin = await login(app, 'admin@test.com')
      const created = await createIncidentViaApi(app, admin.accessToken, 'Status test')
      return { app, created, token: admin.accessToken }
    }

    it('updates status successfully', async () => {
      const { app, created, token } = await setup()
      const res = await app.request(`/api/v1/admin/incidents/${created.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'in_progress' }),
      })
      expect(res.status).toBe(200)
      const body = await res.json() as JsonRes
      const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
      expect(incident.status).toBe('in_progress')
    })

    it('returns 400 with invalid status', async () => {
      const { app, created, token } = await setup()
      const res = await app.request(`/api/v1/admin/incidents/${created.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'invalid' }),
      })
      expect(res.status).toBe(400)
    })
  })

  describe('PATCH /api/v1/admin/incidents/:id/priority', () => {
    async function setup() {
      const app = createTestApp()
      await register(app, 'admin@test.com', 'Admin')
      await promoteToAdmin('admin@test.com')
      const admin = await login(app, 'admin@test.com')
      const created = await createIncidentViaApi(app, admin.accessToken, 'Priority test')
      return { app, created, token: admin.accessToken }
    }

    it('updates priority successfully', async () => {
      const { app, created, token } = await setup()
      const res = await app.request(`/api/v1/admin/incidents/${created.id}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priority: 'high' }),
      })
      expect(res.status).toBe(200)
      const body = await res.json() as JsonRes
      const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
      expect(incident.priority).toBe('high')
    })

    it('returns 400 with invalid priority', async () => {
      const { app, created, token } = await setup()
      const res = await app.request(`/api/v1/admin/incidents/${created.id}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ priority: 'invalid' }),
      })
      expect(res.status).toBe(400)
    })
  })

  describe('PATCH /api/v1/admin/incidents/:id/assign', () => {
    it('assigns incident to the requesting admin when no assignedTo', async () => {
      const app = createTestApp()
      await register(app, 'admin@test.com', 'Admin')
      await promoteToAdmin('admin@test.com')
      const admin = await login(app, 'admin@test.com')
      const created = await createIncidentViaApi(app, admin.accessToken, 'Assign test')

      const res = await app.request(`/api/v1/admin/incidents/${created.id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
        body: JSON.stringify({}),
      })
      expect(res.status).toBe(200)
      const body = await res.json() as JsonRes
      const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
      expect(incident.assigned_to).toBe(admin.user.id)
    })

    it('assigns incident to a specific admin', async () => {
      const app = createTestApp()
      await register(app, 'admin1@test.com', 'Admin1')
      await promoteToAdmin('admin1@test.com')
      const admin1 = await login(app, 'admin1@test.com')

      await register(app, 'admin2@test.com', 'Admin2')
      await promoteToAdmin('admin2@test.com')
      const admin2 = await login(app, 'admin2@test.com')

      const created = await createIncidentViaApi(app, admin1.accessToken, 'Assign test')

      const res = await app.request(`/api/v1/admin/incidents/${created.id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin1.accessToken}` },
        body: JSON.stringify({ assignedTo: admin2.user.id }),
      })
      expect(res.status).toBe(200)
      const body = await res.json() as JsonRes
      const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
      expect(incident.assigned_to).toBe(admin2.user.id)
    })
  })
})
