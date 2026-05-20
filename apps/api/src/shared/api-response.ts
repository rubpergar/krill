import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export function success<T>(c: Context, data: T, status?: ContentfulStatusCode) {
  return c.json({ data }, status ?? 200)
}

export function error(c: Context, message: string, status?: ContentfulStatusCode) {
  return c.json({ error: message }, status ?? 400)
}

export function paginated<T>(
  c: Context,
  data: T[],
  pagination: { page: number; limit: number; total: number },
) {
  return c.json({
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  })
}
