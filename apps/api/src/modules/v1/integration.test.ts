import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { sign } from 'hono/jwt'
import { HttpError } from '../../shared/errors/http-error'
import { HTTPException } from 'hono/http-exception'
import { connectDatabase, closeDatabase, getDatabase } from '../../db/index'
import { v1Routes } from './index'
import { users } from '../../db/schema'
import { eq } from 'drizzle-orm'

type LoginResult = { accessToken: string; refreshToken: string; user: { id: number; email: string; name: string; role: string } }
type JsonRes = { data?: Record<string, unknown>; error?: string }
type PaginationInfo = { page: number; limit: number; total: number; totalPages: number }

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

  app.route('/api/v1', v1Routes)

  return app
}

async function register(app: ReturnType<typeof createTestApp>, email: string, name: string) {
  const res = await app.request('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', name }),
  })
  return res
}

async function login(app: ReturnType<typeof createTestApp>, email: string) {
  const res = await app.request('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }),
  })
  const body = await res.json() as JsonRes
  return body.data as unknown as LoginResult
}

async function promoteToAdmin(email: string) {
  const db = getDatabase()
  db.update(users).set({ role: 'admin' }).where(eq(users.email, email)).run()
}

async function createIncidentViaApi(app: ReturnType<typeof createTestApp>, token: string, title: string, priority?: string) {
  const body: Record<string, unknown> = { title, description: 'Test description' }
  if (priority) body.priority = priority
  const res = await app.request('/api/v1/incidents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const json = await res.json() as JsonRes
  return (json.data as Record<string, unknown>).incident as Record<string, unknown>
}

beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  connectDatabase(':memory:')
})

afterEach(() => {
  closeDatabase()
  delete process.env.JWT_SECRET
})

// ============================================================
// 1. Expired tokens
// ============================================================
describe('Expired token handling', () => {
  it('returns 401 when access token is expired', async () => {
    const app = createTestApp()
    await register(app, 'expired@test.com', 'Expired')
    const loginData = await login(app, 'expired@test.com')

    const expiredToken = await sign(
      { id: loginData.user.id, role: loginData.user.role, exp: Math.floor(Date.now() / 1000) - 3600 },
      process.env.JWT_SECRET!,
      'HS256',
    )

    const res = await app.request('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    })
    expect(res.status).toBe(401)
  })
})

// ============================================================
// 2. Refresh token rotation (reuse prevention)
// ============================================================
describe('Refresh token rotation', () => {
  it('returns 401 when reusing a refresh token after successful refresh', async () => {
    const app = createTestApp()
    await register(app, 'rotate@test.com', 'Rotate')
    const loginData = await login(app, 'rotate@test.com')

    const originalRefresh = loginData.refreshToken

    const refreshRes = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: originalRefresh }),
    })
    expect(refreshRes.status).toBe(200)

    const reuseRes = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: originalRefresh }),
    })
    expect(reuseRes.status).toBe(401)
  })
})

// ============================================================
// 3. 500 Internal Server Error
// ============================================================
describe('500 Internal Server Error', () => {
  it('returns 500 when an unhandled error occurs', async () => {
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

    app.get('/crash', () => {
      throw new Error('Unexpected crash')
    })

    const res = await app.request('/crash')
    expect(res.status).toBe(500)
    const body = await res.json() as { error: string }
    expect(body.error).toBe('Internal server error')
  })
})

// ============================================================
// 4. Admin filters (status, priority, created_by, combined)
// ============================================================
describe('Admin incident filters', () => {
  it('filters by status', async () => {
    const app = createTestApp()
    await register(app, 'admin@test.com', 'Admin')
    await promoteToAdmin('admin@test.com')
    const admin = await login(app, 'admin@test.com')

    await createIncidentViaApi(app, admin.accessToken, 'Open incident')
    const i2 = await createIncidentViaApi(app, admin.accessToken, 'To be closed')

    await app.request(`/api/v1/admin/incidents/${i2.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ status: 'closed' }),
    })

    const res = await app.request('/api/v1/admin/incidents?status=open', {
      headers: { Authorization: `Bearer ${admin.accessToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<Record<string, unknown>>
    expect(list.every((i) => i.status === 'open')).toBe(true)
  })

  it('filters by priority', async () => {
    const app = createTestApp()
    await register(app, 'admin@test.com', 'Admin')
    await promoteToAdmin('admin@test.com')
    const admin = await login(app, 'admin@test.com')

    await createIncidentViaApi(app, admin.accessToken, 'Low prio', 'low')
    await createIncidentViaApi(app, admin.accessToken, 'High prio', 'high')

    const res = await app.request('/api/v1/admin/incidents?priority=high', {
      headers: { Authorization: `Bearer ${admin.accessToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<Record<string, unknown>>
    expect(list.every((i) => i.priority === 'high')).toBe(true)
  })

  it('filters by created_by', async () => {
    const app = createTestApp()
    await register(app, 'admin1@test.com', 'Admin1')
    await promoteToAdmin('admin1@test.com')
    const admin1 = await login(app, 'admin1@test.com')

    await register(app, 'admin2@test.com', 'Admin2')
    await promoteToAdmin('admin2@test.com')
    const admin2 = await login(app, 'admin2@test.com')

    await createIncidentViaApi(app, admin1.accessToken, 'Admin1 incident')
    await createIncidentViaApi(app, admin2.accessToken, 'Admin2 incident')

    const res = await app.request(`/api/v1/admin/incidents?created_by=${admin1.user.id}`, {
      headers: { Authorization: `Bearer ${admin1.accessToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<Record<string, unknown>>
    expect(list.length).toBe(1)
    expect(list[0].title).toBe('Admin1 incident')
  })

  it('combines status and priority filters', async () => {
    const app = createTestApp()
    await register(app, 'admin@test.com', 'Admin')
    await promoteToAdmin('admin@test.com')
    const admin = await login(app, 'admin@test.com')

    const i1 = await createIncidentViaApi(app, admin.accessToken, 'Open high', 'high')
    await createIncidentViaApi(app, admin.accessToken, 'Open low', 'low')
    const i3 = await createIncidentViaApi(app, admin.accessToken, 'Closed high', 'high')

    await app.request(`/api/v1/admin/incidents/${i3.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ status: 'closed' }),
    })
    // Also close i1 to ensure it stays open for the filter
    await app.request(`/api/v1/admin/incidents/${i1.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ status: 'open' }),
    })

    const res = await app.request('/api/v1/admin/incidents?status=open&priority=high', {
      headers: { Authorization: `Bearer ${admin.accessToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const list = body.data as unknown as Array<Record<string, unknown>>
    expect(list.length).toBe(1)
    expect(list[0].title).toBe('Open high')
  })
})

// ============================================================
// 5. Pagination edge cases
// ============================================================
describe('Pagination edge cases', () => {
  it('handles page=0 by treating it as page 1', async () => {
    const app = createTestApp()
    const registerRes = await register(app, 'page0@test.com', 'Page0')
    expect(registerRes.status).toBe(201)
    const loginData = await login(app, 'page0@test.com')
    await createIncidentViaApi(app, loginData.accessToken, 'Issue')

    const res = await app.request('/api/v1/incidents?page=0', {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes & { pagination?: PaginationInfo }
    expect(body.pagination).toBeDefined()
    expect(body.pagination!.page).toBe(1)
  })

  it('handles page=-1 by treating it as page 1', async () => {
    const app = createTestApp()
    await register(app, 'pageneg@test.com', 'PageNeg')
    const loginData = await login(app, 'pageneg@test.com')
    await createIncidentViaApi(app, loginData.accessToken, 'Issue')

    const res = await app.request('/api/v1/incidents?page=-1', {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes & { pagination?: PaginationInfo }
    expect(body.pagination!.page).toBe(1)
  })

  it('returns empty array when page is beyond total results', async () => {
    const app = createTestApp()
    await register(app, 'page999@test.com', 'Page999')
    const loginData = await login(app, 'page999@test.com')
    await createIncidentViaApi(app, loginData.accessToken, 'Issue')

    const res = await app.request('/api/v1/incidents?page=999', {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes & { pagination?: PaginationInfo }
    const list = body.data as unknown as Array<unknown>
    expect(list).toHaveLength(0)
    expect(body.pagination!.total).toBe(1)
  })

  it('handles limit=0 without errors', async () => {
    const app = createTestApp()
    await register(app, 'limit0@test.com', 'Limit0')
    const loginData = await login(app, 'limit0@test.com')
    await createIncidentViaApi(app, loginData.accessToken, 'Issue')

    const res = await app.request('/api/v1/incidents?limit=0', {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    })
    expect(res.status).toBe(200)
  })
})

// ============================================================
// 6. Assign edge cases
// ============================================================
describe('Admin incident assign edge cases', () => {
  it('returns 404 when assigning to a non-existent user', async () => {
    const app = createTestApp()
    await register(app, 'admin@test.com', 'Admin')
    await promoteToAdmin('admin@test.com')
    const admin = await login(app, 'admin@test.com')
    const created = await createIncidentViaApi(app, admin.accessToken, 'Assign non-existent')

    const res = await app.request(`/api/v1/admin/incidents/${created.id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ assignedTo: 99999 }),
    })
    expect(res.status).toBe(404)
  })

  it('unassigns incident by sending assignedTo null', async () => {
    const app = createTestApp()
    await register(app, 'admin@test.com', 'Admin')
    await promoteToAdmin('admin@test.com')
    const admin = await login(app, 'admin@test.com')
    const created = await createIncidentViaApi(app, admin.accessToken, 'Unassign test')

    await app.request(`/api/v1/admin/incidents/${created.id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ assignedTo: admin.user.id }),
    })

    const res = await app.request(`/api/v1/admin/incidents/${created.id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ assignedTo: null }),
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const incident = (body.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(incident.assigned_to).toBeNull()
  })

  it('returns 403 when a regular user tries to assign', async () => {
    const app = createTestApp()
    await register(app, 'user@test.com', 'User')
    const user = await login(app, 'user@test.com')

    const res = await app.request('/api/v1/admin/incidents/1/assign', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.accessToken}` },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(403)
  })

  it('re-assigns an already assigned incident to a different admin', async () => {
    const app = createTestApp()
    await register(app, 'admin1@test.com', 'Admin1')
    await promoteToAdmin('admin1@test.com')
    const admin1 = await login(app, 'admin1@test.com')

    await register(app, 'admin2@test.com', 'Admin2')
    await promoteToAdmin('admin2@test.com')
    const admin2 = await login(app, 'admin2@test.com')

    const created = await createIncidentViaApi(app, admin1.accessToken, 'Reassign test')

    await app.request(`/api/v1/admin/incidents/${created.id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin1.accessToken}` },
      body: JSON.stringify({ assignedTo: admin1.user.id }),
    })

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

// ============================================================
// 7. Status/priority on non-existent incident
// ============================================================
describe('Admin incident update on non-existent incident', () => {
  it('returns 404 when updating status on non-existent incident', async () => {
    const app = createTestApp()
    await register(app, 'admin@test.com', 'Admin')
    await promoteToAdmin('admin@test.com')
    const admin = await login(app, 'admin@test.com')

    const res = await app.request('/api/v1/admin/incidents/99999/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ status: 'resolved' }),
    })
    expect(res.status).toBe(404)
  })

  it('returns 404 when updating priority on non-existent incident', async () => {
    const app = createTestApp()
    await register(app, 'admin@test.com', 'Admin')
    await promoteToAdmin('admin@test.com')
    const admin = await login(app, 'admin@test.com')

    const res = await app.request('/api/v1/admin/incidents/99999/priority', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ priority: 'high' }),
    })
    expect(res.status).toBe(404)
  })
})

// ============================================================
// 8. Full E2E user → admin flow
// ============================================================
describe('Full E2E: user + admin incident lifecycle', () => {
  it('completes a full user and admin incident lifecycle', async () => {
    const app = createTestApp()

    // --- USER FLOW ---
    const regUser = await register(app, 'user@test.com', 'Regular User')
    expect(regUser.status).toBe(201)

    const user = await login(app, 'user@test.com')
    expect(user.accessToken).toBeDefined()

    const incident = await createIncidentViaApi(app, user.accessToken, 'Broken AC', 'high')
    expect(incident.title).toBe('Broken AC')
    expect(incident.status).toBe('open')
    expect(incident.priority).toBe('high')

    const userListRes = await app.request('/api/v1/incidents', {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    })
    expect(userListRes.status).toBe(200)
    const userListBody = await userListRes.json() as JsonRes
    const userList = userListBody.data as unknown as Array<Record<string, unknown>>
    expect(userList.length).toBe(1)

    // --- ADMIN FLOW ---
    const regAdmin = await register(app, 'admin@coworking.com', 'Admin User')
    expect(regAdmin.status).toBe(201)

    await promoteToAdmin('admin@coworking.com')

    const admin = await login(app, 'admin@coworking.com')
    expect(admin.user.role).toBe('admin')

    const adminListRes = await app.request('/api/v1/admin/incidents', {
      headers: { Authorization: `Bearer ${admin.accessToken}` },
    })
    expect(adminListRes.status).toBe(200)
    const adminListBody = await adminListRes.json() as JsonRes
    const adminList = adminListBody.data as unknown as Array<Record<string, unknown>>
    expect(adminList.length).toBe(1)

    const filterRes = await app.request(`/api/v1/admin/incidents?priority=high`, {
      headers: { Authorization: `Bearer ${admin.accessToken}` },
    })
    expect(filterRes.status).toBe(200)
    const filterBody = await filterRes.json() as JsonRes
    const filtered = filterBody.data as unknown as Array<Record<string, unknown>>
    expect(filtered.length).toBe(1)

    const statusRes = await app.request(`/api/v1/admin/incidents/${incident.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ status: 'in_progress' }),
    })
    expect(statusRes.status).toBe(200)
    const statusBody = await statusRes.json() as JsonRes
    const statusIncident = (statusBody.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(statusIncident.status).toBe('in_progress')

    const priorityRes = await app.request(`/api/v1/admin/incidents/${incident.id}/priority`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ priority: 'critical' }),
    })
    expect(priorityRes.status).toBe(200)
    const priorityBody = await priorityRes.json() as JsonRes
    const priorityIncident = (priorityBody.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(priorityIncident.priority).toBe('critical')

    const assignRes = await app.request(`/api/v1/admin/incidents/${incident.id}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.accessToken}` },
      body: JSON.stringify({ assignedTo: admin.user.id }),
    })
    expect(assignRes.status).toBe(200)
    const assignBody = await assignRes.json() as JsonRes
    const assignIncident = (assignBody.data as Record<string, unknown>).incident as Record<string, unknown>
    expect(assignIncident.assigned_to).toBe(admin.user.id)
  })
})
