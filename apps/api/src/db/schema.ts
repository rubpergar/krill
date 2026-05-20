import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text().notNull(),
  role: text().notNull().default('user'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const refreshTokens = sqliteTable('refresh_tokens', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  tokenHash: text('token_hash').notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
})

export const incidents = sqliteTable('incidents', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text().notNull(),
  status: text().notNull().default('open'),
  priority: text().notNull().default('medium'),
  createdBy: integer('created_by').notNull().references(() => users.id),
  assignedTo: integer('assigned_to').references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})
