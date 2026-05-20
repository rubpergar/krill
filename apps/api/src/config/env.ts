import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  JWT_SECRET: z.string().default('dev-secret-change-in-production'),
  DB_PATH: z.string().default('./data/krill.db'),
})

export type Env = z.infer<typeof envSchema>
