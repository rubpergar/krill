import type { FastifyReply, FastifyRequest } from 'fastify';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({
      ok: false,
      error: { code: 'UNAUTHORIZED', message: 'Token inválido o ausente' },
    });
  }
}
