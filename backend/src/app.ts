import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import { adminRoutes } from './api/v1/admin/admin.routes.js';
import { authRoutes } from './api/v1/auth/auth.routes.js';
import { commentRoutes } from './api/v1/comments/comments.routes.js';
import { incidentRoutes } from './api/v1/incidents/incidents.routes.js';
import { env } from './config/env.js';
import { authService } from './modules/auth/auth.service.js';
import { AppError } from './shared/errors/app-error.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Incidencias Coworking API',
        description: 'API de gestión de incidencias para espacios de coworking',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:3000' }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  await app.register(jwt, { secret: env.jwtSecret });

  app.setErrorHandler((err, _request, reply) => {
    if (err instanceof AppError) {
      return reply.status(err.statusCode).send({
        ok: false,
        error: { code: err.code, message: err.message },
      });
    }

    reply.status(500).send({
      ok: false,
      error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' },
    });
  });

  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(incidentRoutes, { prefix: '/api/v1/incidents' });
  await app.register(commentRoutes, { prefix: '/api/v1/incidents' });
  await app.register(adminRoutes, { prefix: '/api/v1/admin' });

  if (env.adminEmail && env.adminPassword) {
    await authService.seedAdmin(env.adminEmail, env.adminPassword);
  }

  return app;
}
