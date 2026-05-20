import type { FastifyInstance, FastifyReply } from 'fastify';
import type { JwtPayload } from '../../../modules/auth/auth.types.js';
import { commentService } from '../../../modules/comments/comments.service.js';
import { incidentService } from '../../../modules/incidents/incidents.service.js';
import { AppError } from '../../../shared/errors/app-error.js';
import { authenticate } from '../../../shared/middleware/auth.middleware.js';
import {
  createIncidentSchema,
  incidentParamsSchema,
  listIncidentsQuerySchema,
  updatePrioritySchema,
  updateStatusSchema,
} from './incidents.schema.js';

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

export async function incidentRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const body = createIncidentSchema.body.parse(req.body);
      const user = getUser(req);
      const incident = incidentService.create(body, user.id);
      return reply.status(201).send({ ok: true, data: { incident } });
    } catch (err) {
      return replyError(reply, err);
    }
  });

  app.get('/', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const query = listIncidentsQuerySchema.querystring.parse(req.query);
      const user = getUser(req);
      const filters = {
        status: query.status ? query.status.split(',') : undefined,
        priority: query.priority ? query.priority.split(',') : undefined,
        category: query.category ? query.category.split(',') : undefined,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        page: query.page,
        limit: query.limit,
      };
      const result = incidentService.listByUserFiltered(user.id, filters);
      return {
        ok: true,
        data: { incidents: result.incidents, meta: result.meta },
      };
    } catch (err) {
      return replyError(reply, err);
    }
  });

  app.get('/:id', { preHandler: [authenticate] }, async (req, reply) => {
    try {
      const { id } = incidentParamsSchema.params.parse(req.params);
      const user = getUser(req);
      const admin = isAdmin(req);
      const incident = incidentService.getById(id, user.id, admin);
      const comments = commentService.listByIncident(id, user.id, admin);
      return { ok: true, data: { incident: { ...incident, comments } } };
    } catch (err) {
      return replyError(reply, err);
    }
  });

  app.patch(
    '/:id/status',
    { preHandler: [authenticate] },
    async (req, reply) => {
      try {
        const { id } = updateStatusSchema.params.parse(req.params);
        const body = updateStatusSchema.body.parse(req.body);
        const user = getUser(req);
        const incident = incidentService.updateStatus(
          id,
          body,
          user.id,
          isAdmin(req),
        );
        return { ok: true, data: { incident } };
      } catch (err) {
        return replyError(reply, err);
      }
    },
  );

  app.patch(
    '/:id/priority',
    { preHandler: [authenticate] },
    async (req, reply) => {
      try {
        const { id } = updatePrioritySchema.params.parse(req.params);
        const body = updatePrioritySchema.body.parse(req.body);
        const user = getUser(req);
        const incident = incidentService.updatePriority(
          id,
          body,
          user.id,
          isAdmin(req),
        );
        return { ok: true, data: { incident } };
      } catch (err) {
        return replyError(reply, err);
      }
    },
  );
}
