import { z } from '@hono/zod-openapi'

export const registerSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
})

export const loginSchema = z.object({
  email: z.string().email().transform(v => v.toLowerCase().trim()),
  password: z.string().min(1),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
