import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { OpenAPIHono } from '@hono/zod-openapi'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { HttpError } from '../../shared/errors/http-error'
import { HTTPException } from 'hono/http-exception'
import { connectDatabase, closeDatabase } from '../../db/index'
import { v1Routes } from './index'

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

describe('GET /api/v1/health', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret'
    connectDatabase(':memory:')
  })

  afterEach(() => {
    closeDatabase()
    delete process.env.JWT_SECRET
  })

  it('returns 200 with status ok and timestamp', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/health')
    expect(res.status).toBe(200)
    const body = await res.json() as { status: string; timestamp: string }
    expect(body.status).toBe('ok')
    expect(body.timestamp).toBeDefined()
  })

  it('timestamp is a valid ISO 8601 date', async () => {
    const app = createTestApp()
    const res = await app.request('/api/v1/health')
    const body = await res.json() as { status: string; timestamp: string }
    const parsed = new Date(body.timestamp)
    expect(parsed.toISOString()).toBe(body.timestamp)
  })
})
