import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { HTTPException } from 'hono/http-exception'
import { HttpError } from '../shared/errors/http-error'
import { v1Routes } from '../modules/v1/index'

export function createApp() {
  const app = new OpenAPIHono()

  app.onError((err, c) => {
    if (err instanceof HttpError) {
      return c.json({ error: err.message }, err.statusCode as Parameters<typeof c.json>[1])
    }
    if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status as Parameters<typeof c.json>[1])
    }
    return c.json({ error: 'Internal server error' }, 500)
  })

  app.doc('/openapi', {
    openapi: '3.1.0',
    info: {
      title: 'Coworking Incidencias API',
      version: '1.0.0',
      description: 'API de gestión de incidencias para espacios de coworking',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Development' }],
  })

  app.get('/docs', swaggerUI({ url: '/openapi' }))

  app.route('/api/v1', v1Routes)

  return app
}
