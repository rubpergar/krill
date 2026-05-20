import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UserRole } from '../../modules/auth/auth.types.js';

export function requireRole(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { role: UserRole } | undefined;
    if (!payload || !roles.includes(payload.role)) {
      return reply.status(403).send({
        ok: false,
        error: {
          code: 'FORBIDDEN',
          message: 'No tienes permisos para acceder a este recurso',
        },
      });
    }
  };
}
