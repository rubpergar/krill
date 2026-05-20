import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { HttpError } from '../../shared/errors/http-error'
import { HTTPException } from 'hono/http-exception'
import { connectDatabase, closeDatabase } from '../../db/index'
import { incidentsRoutes } from './incidents.routes'
import { authRoutes } from '../auth/auth.routes'

type LoginResult = { accessToken: string; refreshToken: string; user: Record<string, unknown> }
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

  return app
}

async function registerAndLogin(app: ReturnType<typeof createTestApp>) {
  await app.request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@test.com', password: 'password123', name: 'Test User' }),
  })
  const loginRes = await app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@test.com', password: 'password123' }),
  })
  const body = await loginRes.json() as JsonRes
  return (body.data as unknown as LoginResult).accessToken
}

beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  connectDatabase(':memory:')
})

afterEach(() => {
  closeDatabase()
  delete process.env.JWT_SECRET
})

describe('POST /api/v1/incidents', () => {
  it('creates an incident and returns 201 with data', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test incident', description: 'Something is broken' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as JsonRes
    const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(incident.title).toBe('Test incident')
    expect(incident.description).toBe('Something is broken')
    expect(incident.status).toBe('open')
    expect(incident.priority).toBe('medium')
    expect(incident.created_by).toBeDefined()
    expect(incident.created_at).toBeDefined()
    expect(incident.updated_at).toBeDefined()
  })

  it('returns 401 without token', async () => {
    const app = createTestApp()

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test', description: 'Desc' }),
    })
    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid token', async () => {
    const app = createTestApp()

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer invalid-token' },
      body: JSON.stringify({ title: 'Test', description: 'Desc' }),
    })
    expect(res.status).toBe(401)
  })

  it('returns 400 with empty title', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: '', description: 'Desc' }),
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 with title over 200 chars', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'x'.repeat(201), description: 'Desc' }),
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 without description', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test' }),
    })
    expect(res.status).toBe(400)
  })

  it('returns 400 with invalid priority', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Test', description: 'Desc', priority: 'urgent' }),
    })
    expect(res.status).toBe(400)
  })

  it('creates incident with custom priority', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'High priority', description: 'Urgent issue', priority: 'high' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as JsonRes
    const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(incident.priority).toBe('high')
  })

  it('creates incident with default medium priority when not provided', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Default priority', description: 'Desc' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as JsonRes
    const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(incident.priority).toBe('medium')
  })

  it('sets status to open by default', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'New', description: 'Desc' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as JsonRes
    const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(incident.status).toBe('open')
  })
})

describe('GET /api/v1/incidents', () => {
  async function createIncident(app: ReturnType<typeof createTestApp>, token: string, title: string, priority?: string) {
    const body: Record<string, unknown> = { title, description: 'Desc' }
    if (priority) body.priority = priority
    return app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })
  }

  it('returns 200 with list of user incidents', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)
    await createIncident(app, token, 'Issue 1')
    await createIncident(app, token, 'Issue 2')

    const res = await app.request('/api/v1/incidents', { headers: { Authorization: `Bearer ${token}` } })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<Record<string, unknown>>
    expect(list).toHaveLength(2)
    expect(list[0].title).toBe('Issue 2')
  })

  it('returns 401 without token', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/incidents')
    expect(res.status).toBe(401)
  })

  it('returns pagination metadata', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)
    for (let i = 0; i < 5; i++) {
      await createIncident(app, token, `Issue ${i}`)
    }

    const res = await app.request('/api/v1/incidents?page=1&limit=2', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes & { pagination?: Record<string, unknown> }
    const list = body.data as unknown as Array<unknown>
    expect(list).toHaveLength(2)
    expect(body.pagination).toBeDefined()
    expect(body.pagination!.page).toBe(1)
    expect(body.pagination!.limit).toBe(2)
    expect(body.pagination!.total).toBe(5)
    expect(body.pagination!.totalPages).toBe(3)
  })

  it('only shows incidents belonging to the authenticated user', async () => {
    const app = createTestApp()
    const token1 = await registerAndLogin(app)
    await createIncident(app, token1, 'User 1 incident')

    // Register second user
    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user2@test.com', password: 'password123', name: 'User 2' }),
    })
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user2@test.com', password: 'password123' }),
    })
    const loginBody = await loginRes.json() as JsonRes
    const token2 = (loginBody.data as unknown as LoginResult).accessToken
    await createIncident(app, token2, 'User 2 incident')

    const res = await app.request('/api/v1/incidents', {
      headers: { Authorization: `Bearer ${token1}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<Record<string, unknown>>
    expect(list).toHaveLength(1)
    expect(list[0].title).toBe('User 1 incident')
  })

  it('returns empty array when user has no incidents', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<unknown>
    expect(list).toHaveLength(0)
  })

  it('filters by status', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)
    await createIncident(app, token, 'Open issue')

    // Manually update status to closed via DB
    const db = await import('../../db/index').then(m => m.getDatabase())
    const { incidents } = await import('../../db/schema')
    const { eq } = await import('drizzle-orm')
    db.update(incidents).set({ status: 'closed' }).where(eq(incidents.title, 'Open issue')).run()
    await createIncident(app, token, 'Another open')

    const res = await app.request('/api/v1/incidents?status=open', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<Record<string, unknown>>
    expect(list).toHaveLength(1)
    expect(list[0].title).toBe('Another open')
  })
})

describe('GET /api/v1/incidents/:id', () => {
  it('returns 200 with incident detail for the owner', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const createRes = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Detail test', description: 'Desc' }),
    })
    const createBody = await createRes.json() as JsonRes
    const created = (createBody.data as Record<string, unknown>).incident as Record<string, unknown>

    const res = await app.request(`/api/v1/incidents/${created.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(incident.id).toBe(created.id)
    expect(incident.title).toBe('Detail test')
  })

  it('returns 404 for non-existent id', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)

    const res = await app.request('/api/v1/incidents/99999', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(404)
  })

  it('returns 404 when incident belongs to another user', async () => {
    const app = createTestApp()
    const token1 = await registerAndLogin(app)

    const createRes = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token1}` },
      body: JSON.stringify({ title: 'Not yours', description: 'Desc' }),
    })
    const createBody = await createRes.json() as JsonRes
    const created = (createBody.data as Record<string, unknown>).incident as Record<string, unknown>

    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'other@test.com', password: 'password123', name: 'Other' }),
    })
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'other@test.com', password: 'password123' }),
    })
    const loginBody = await loginRes.json() as JsonRes
    const token2 = (loginBody.data as unknown as LoginResult).accessToken

    const res = await app.request(`/api/v1/incidents/${created.id}`, {
      headers: { Authorization: `Bearer ${token2}` },
    })
    expect(res.status).toBe(404)
  })

  it('returns 401 without token', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/incidents/1')
    expect(res.status).toBe(401)
  })
})
