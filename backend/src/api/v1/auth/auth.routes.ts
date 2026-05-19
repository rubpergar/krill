import type { FastifyInstance, FastifyReply } from 'fastify';
import { authService } from '../../../modules/auth/auth.service.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';
import { loginSchema, registerSchema } from './auth.schema.js';

function replyWithError(reply: FastifyReply, err: AppError) {
  return reply.status(err.statusCode).send({
    ok: false,
    error: { code: err.code, message: err.message },
  });
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (req, reply) => {
    try {
      const body = registerSchema.body.parse(req.body);
      const { user } = await authService.register(body);
      const token = app.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.status(201).send({ ok: true, data: { user, token } });
    } catch (err) {
      if (err instanceof AppError) {
        return replyWithError(reply, err);
      }
      return reply.status(400).send({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: (err as Error).message },
      });
    }
  });

  app.post('/login', async (req, reply) => {
    try {
      const body = loginSchema.body.parse(req.body);
      const { user } = await authService.login(body);
      const token = app.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return reply.send({ ok: true, data: { user, token } });
    } catch (err) {
      if (err instanceof AppError) {
        return replyWithError(reply, err);
      }
      return reply.status(400).send({
        ok: false,
        error: { code: 'VALIDATION_ERROR', message: (err as Error).message },
      });
    }
  });

  app.get('/me', { preHandler: [authenticate] }, async (req) => {
    return { ok: true, data: { user: req.user } };
  });
}
