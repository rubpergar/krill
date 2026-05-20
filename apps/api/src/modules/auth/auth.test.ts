import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { HttpError } from '../../shared/errors/http-error'
import { HTTPException } from 'hono/http-exception'
import { connectDatabase, closeDatabase } from '../../db/index'
import { authRoutes } from './auth.routes'

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

  return app
}

type UserProfile = { id: number; email: string; name: string; role: string }
type LoginResult = { accessToken: string; refreshToken: string; user: UserProfile }
type JsonRes = { data?: Record<string, unknown>; error?: string }

beforeEach(() => {
  process.env.JWT_SECRET = 'test-secret'
  connectDatabase(':memory:')
})

afterEach(() => {
  closeDatabase()
  delete process.env.JWT_SECRET
})

describe('POST /api/v1/auth/register', () => {
  it('creates a user and returns 201 with profile', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test User' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as JsonRes
    const user = (body.data as Record<string, unknown>).user as UserProfile
    expect(user.email).toBe('test@example.com')
    expect(user.name).toBe('Test User')
    expect((user as Record<string, unknown>).passwordHash).toBeUndefined()
    expect(user.id).toBeDefined()
  })

  it('rejects duplicate email with 409', async () => {
    const app = createTestApp()
    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dup@example.com', password: 'password123', name: 'User' }),
    })
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'dup@example.com', password: 'password123', name: 'User' }),
    })
    expect(res.status).toBe(409)
  })

  it('rejects invalid email with 400', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', password: 'password123', name: 'User' }),
    })
    expect(res.status).toBe(400)
  })

  it('rejects short password with 400', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'a@b.com', password: '1234567', name: 'User' }),
    })
    expect(res.status).toBe(400)
  })

  it('normalizes email to lowercase', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'UPPERCASE@EXAMPLE.COM', password: 'password123', name: 'User' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json() as JsonRes
    const user = (body.data as Record<string, unknown>).user as UserProfile
    expect(user.email).toBe('uppercase@example.com')
  })
})

describe('POST /api/v1/auth/login', () => {
  it('returns 200 with tokens and user on valid credentials', async () => {
    const app = createTestApp()
    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@test.com', password: 'password123', name: 'Login User' }),
    })
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@test.com', password: 'password123' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const data = body.data as unknown as LoginResult
    expect(data.accessToken).toBeDefined()
    expect(data.refreshToken).toBeDefined()
    expect(data.user.email).toBe('login@test.com')
  })

  it('returns 401 on wrong password', async () => {
    const app = createTestApp()
    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@test.com', password: 'password123', name: 'Wrong' }),
    })
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@test.com', password: 'wrongpassword' }),
    })
    expect(res.status).toBe(401)
  })

  it('returns 401 on non-existent email', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@test.com', password: 'password123' }),
    })
    expect(res.status).toBe(401)
  })
})

describe('GET /api/v1/auth/me', () => {
  async function registerAndLogin(app: ReturnType<typeof createTestApp>) {
    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'me@test.com', password: 'password123', name: 'Me User' }),
    })
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'me@test.com', password: 'password123' }),
    })
    const body = await loginRes.json() as JsonRes
    return (body.data as unknown as LoginResult).accessToken
  }

  it('returns 200 with user profile when token is valid', async () => {
    const app = createTestApp()
    const token = await registerAndLogin(app)
    const res = await app.request('/api/v1/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const user = (body.data as Record<string, unknown>).user as UserProfile
    expect(user.email).toBe('me@test.com')
    expect(user.name).toBe('Me User')
  })

  it('returns 401 without token', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/me', { method: 'GET' })
    expect(res.status).toBe(401)
  })

  it('returns 401 with invalid token', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/me', {
      method: 'GET',
      headers: { Authorization: 'Bearer invalid-token' },
    })
    expect(res.status).toBe(401)
  })
})

describe('POST /api/v1/auth/refresh', () => {
  async function registerAndLogin(app: ReturnType<typeof createTestApp>) {
    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'refresh@test.com', password: 'password123', name: 'Refresh' }),
    })
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'refresh@test.com', password: 'password123' }),
    })
    const body = await loginRes.json() as JsonRes
    return body.data as unknown as LoginResult
  }

  it('returns 200 with new token pair when refresh token is valid', async () => {
    const app = createTestApp()
    const loginData = await registerAndLogin(app)

    const res = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: loginData.refreshToken }),
    })
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    const data = body.data as unknown as LoginResult
    expect(data.accessToken).toBeDefined()
    expect(data.refreshToken).toBeDefined()
    expect(data.accessToken).not.toBe(loginData.accessToken)
  })

  it('returns 401 with invalid refresh token', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: 'invalid-refresh-token' }),
    })
    expect(res.status).toBe(401)
  })
})

describe('POST /api/v1/auth/logout', () => {
  async function registerAndLogin(app: ReturnType<typeof createTestApp>) {
    await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'logout@test.com', password: 'password123', name: 'Logout' }),
    })
    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'logout@test.com', password: 'password123' }),
    })
    const body = await loginRes.json() as JsonRes
    return body.data as unknown as LoginResult
  }

  it('returns 204 and invalidates refresh token', async () => {
    const app = createTestApp()
    const loginData = await registerAndLogin(app)

    const logoutRes = await app.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: loginData.refreshToken }),
    })
    expect(logoutRes.status).toBe(204)

    const refreshRes = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: loginData.refreshToken }),
    })
    expect(refreshRes.status).toBe(401)
  })
})

describe('Full auth flow (integration)', () => {
  it('register → login → me → refresh → logout', async () => {
    const app = createTestApp()

    const regRes = await app.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'flow@test.com', password: 'password123', name: 'Flow' }),
    })
    expect(regRes.status).toBe(201)

    const loginRes = await app.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'flow@test.com', password: 'password123' }),
    })
    expect(loginRes.status).toBe(200)
    const loginBody = await loginRes.json() as JsonRes
    const loginData = loginBody.data as unknown as LoginResult
    const accessToken = loginData.accessToken
    const refreshToken = loginData.refreshToken

    const meRes = await app.request('/api/v1/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    expect(meRes.status).toBe(200)

    const refreshRes = await app.request('/api/v1/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    expect(refreshRes.status).toBe(200)

    const logoutRes = await app.request('/api/v1/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    expect(logoutRes.status).toBe(204)
  })
})
