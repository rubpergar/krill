import type { FastifyInstance, FastifyReply } from 'fastify';
import { incidentService } from '../../../modules/incidents/incidents.service.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';
import { requireRole } from '../../../shared/middleware/role.middleware.js';
import { listIncidentsQuerySchema } from '../incidents/incidents.schema.js';

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

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    { preHandler: [authenticate, requireRole('admin')] },
    async () => {
      return { ok: true };
    },
  );

  app.get(
    '/incidents',
    { preHandler: [authenticate, requireRole('admin')] },
    async (req, reply) => {
      try {
        const query = listIncidentsQuerySchema.querystring.parse(req.query);
        const filters = {
          status: query.status ? query.status.split(',') : undefined,
          priority: query.priority ? query.priority.split(',') : undefined,
          category: query.category ? query.category.split(',') : undefined,
          dateFrom: query.dateFrom,
          dateTo: query.dateTo,
          page: query.page,
          limit: query.limit,
        };
        const result = incidentService.listAllFiltered(filters);
        return {
          ok: true,
          data: { incidents: result.incidents, meta: result.meta },
        };
      } catch (err) {
        return replyError(reply, err);
      }
    },
  );
}
