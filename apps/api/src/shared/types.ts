import type { drizzle } from 'drizzle-orm/better-sqlite3'
import type * as schema from '../db/schema'

export type DB = ReturnType<typeof drizzle<typeof schema>>
