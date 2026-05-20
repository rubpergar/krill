import type { FastifyInstance, FastifyReply } from 'fastify';
import type { JwtPayload } from '../../../modules/auth/auth.types.js';
import { commentService } from '../../../modules/comments/comments.service.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';
import { createCommentSchema } from './comments.schema.js';

function getUser(request: { user: unknown }): JwtPayload {
  return request.user as JwtPayload;
}

function isAdmin(request: { user: unknown }): boolean {
  return getUser(request).role === 'admin';
}

function replyError(reply: FastifyReply, err: unknown) {
  if (err instanceof AppError) {
    return reply.status(err.statusCode).send({
      ok: false,
      error: { code: err.code, message: err.message },
    });
  }
  return reply.status(400).send({
    ok: false,
    error: { code: 'VALIDATION_ERROR', message: (err as Error).message },
  });
}

export async function commentRoutes(app: FastifyInstance) {
  app.post(
    '/:id/comments',
    { preHandler: [authenticate] },
    async (req, reply) => {
      try {
        const { id } = createCommentSchema.params.parse(req.params);
        const body = createCommentSchema.body.parse(req.body);
        const user = getUser(req);
        const comment = commentService.add(body, id, user.id, isAdmin(req));
        return reply.status(201).send({ ok: true, data: { comment } });
      } catch (err) {
        return replyError(reply, err);
      }
    },
  );

  app.get(
    '/:id/comments',
    { preHandler: [authenticate] },
    async (req, reply) => {
      try {
        const { id } = createCommentSchema.params.parse(req.params);
        const user = getUser(req);
        const comments = commentService.listByIncident(
          id,
          user.id,
          isAdmin(req),
        );
        return { ok: true, data: { comments } };
      } catch (err) {
        return replyError(reply, err);
      }
    },
  );
}
