import { z } from 'zod';

const statusEnum = z.enum(['open', 'in_progress', 'resolved', 'closed']);
const priorityEnum = z.enum(['low', 'medium', 'high', 'critical']);
const categoryEnum = z.enum([
  'hardware',
  'software',
  'network',
  'facilities',
  'other',
]);

export const createIncidentSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'El título debe tener al menos 3 caracteres')
      .max(200, 'El título no puede exceder 200 caracteres')
      .trim(),
    description: z
      .string()
      .min(1, 'La descripción es requerida')
      .max(2000, 'La descripción no puede exceder 2000 caracteres')
      .trim(),
    category: categoryEnum,
    priority: priorityEnum,
  }),
};

export const updateStatusSchema = {
  body: z.object({
    status: statusEnum,
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const updatePrioritySchema = {
  body: z.object({
    priority: priorityEnum,
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
};

export const incidentParamsSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
};

const isoDateRegex = /^\d{4}-\d{2}-\d{2}/;

export const listIncidentsQuerySchema = {
  querystring: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const valid = ['open', 'in_progress', 'resolved', 'closed'];
          return val.split(',').every((s) => valid.includes(s));
        },
        { message: 'Valor de status inválido' },
      ),
    priority: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const valid = ['low', 'medium', 'high', 'critical'];
          return val.split(',').every((p) => valid.includes(p));
        },
        { message: 'Valor de priority inválido' },
      ),
    category: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const valid = [
            'hardware',
            'software',
            'network',
            'facilities',
            'other',
          ];
          return val.split(',').every((c) => valid.includes(c));
        },
        { message: 'Valor de category inválido' },
      ),
    dateFrom: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return isoDateRegex.test(val);
        },
        { message: 'dateFrom debe ser una fecha ISO (YYYY-MM-DD)' },
      ),
    dateTo: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          return isoDateRegex.test(val);
        },
        { message: 'dateTo debe ser una fecha ISO (YYYY-MM-DD)' },
      ),
  }),
};
