import { z } from 'zod';

export const createCommentSchema = {
  body: z.object({
    content: z.string().min(1, 'El comentario no puede estar vacío').trim(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};
