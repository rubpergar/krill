import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { success, error, paginated } from './api-response'

type JsonRes = { data?: unknown; error?: string; pagination?: { page: number; limit: number; total: number; totalPages: number } }

function createTestApp() {
  const app = new Hono()

  app.get('/success-default', (c) => success(c, { message: 'ok' }))
  app.get('/success-custom', (c) => success(c, { message: 'created' }, 201))
  app.get('/error-default', (c) => error(c, 'bad request'))
  app.get('/error-custom', (c) => error(c, 'unauthorized', 401))
  app.get('/paginated', (c) => paginated(c, [{ id: 1 }], { page: 1, limit: 10, total: 25 }))

  return app
}

describe('api-response helpers', () => {
  it('success returns { data } with default status 200', async () => {
    const app = createTestApp()
    const res = await app.request('/success-default')
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    expect(body).toEqual({ data: { message: 'ok' } })
  })

  it('success returns { data } with custom status', async () => {
    const app = createTestApp()
    const res = await app.request('/success-custom')
    expect(res.status).toBe(201)
    const body = await res.json() as JsonRes
    expect(body).toEqual({ data: { message: 'created' } })
  })

  it('error returns { error } with default status 400', async () => {
    const app = createTestApp()
    const res = await app.request('/error-default')
    expect(res.status).toBe(400)
    const body = await res.json() as JsonRes
    expect(body).toEqual({ error: 'bad request' })
  })

  it('error returns { error } with custom status', async () => {
    const app = createTestApp()
    const res = await app.request('/error-custom')
    expect(res.status).toBe(401)
    const body = await res.json() as JsonRes
    expect(body).toEqual({ error: 'unauthorized' })
  })

  it('paginated returns { data, pagination }', async () => {
    const app = createTestApp()
    const res = await app.request('/paginated')
    expect(res.status).toBe(200)
    const body = await res.json() as JsonRes
    expect(body.data).toEqual([{ id: 1 }])
    expect(body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    })
  })
})
