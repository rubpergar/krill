import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { sign } from 'hono/jwt'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { HttpError } from '../errors/http-error'
import { HTTPException } from 'hono/http-exception'
import { connectDatabase, closeDatabase } from '../../db/index'
import { requireAuth, requireRole } from './auth.middleware'

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

  app.get('/protected', requireAuth, (c) => {
    const payload = c.get('jwtPayload') as { id: number; role: string }
    return c.json({ data: { id: payload.id, role: payload.role } })
  })

  app.get('/admin', requireAuth, requireRole('admin'), (c) => {
    return c.json({ data: { ok: true } })
  })

  return app
}

async function makeToken(payload: Record<string, unknown>) {
  const secret = process.env.JWT_SECRET || 'test-secret'
  return sign({ ...payload, exp: Math.floor(Date.now() / 1000) + 60 }, secret, 'HS256')
}

beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  connectDatabase(':memory:')
})

afterEach(() => {
  closeDatabase()
  delete process.env.JWT_SECRET
})

describe('requireAuth', () => {
  it('allows request with valid token and sets jwtPayload', async () => {
    const app = createApp()
    const token = await makeToken({ id: 1, role: 'user' })
    const res = await app.request('/protected', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { data: { id: number; role: string } }
    expect(body.data.id).toBe(1)
    expect(body.data.role).toBe('user')
  })

  it('returns 401 without token', async () => {
    const app = createApp()
    const res = await app.request('/protected')
    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid token', async () => {
    const app = createApp()
    const res = await app.request('/protected', {
      headers: { Authorization: 'Bearer invalid-token' },
    })
    expect(res.status).toBe(401)
  })
})

describe('requireRole', () => {
  it('allows admin role', async () => {
    const app = createApp()
    const token = await makeToken({ id: 1, role: 'admin' })
    const res = await app.request('/admin', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as { data: { ok: boolean } }
    expect(body.data.ok).toBe(true)
  })

  it('returns 403 for user role on admin route', async () => {
    const app = createApp()
    const token = await makeToken({ id: 2, role: 'user' })
    const res = await app.request('/admin', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(403)
  })

  it('returns 401 instead of 403 when not authenticated', async () => {
    const app = createApp()
    const res = await app.request('/admin')
    expect(res.status).toBe(401)
  })
})
