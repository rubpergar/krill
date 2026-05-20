import type { DB } from '../../shared/types'
import { users, refreshTokens } from '../../db/schema'
import { eq } from 'drizzle-orm'

export type UserRow = {
  id: number
  email: string
  passwordHash: string
  name: string
  role: string
  createdAt: string
  updatedAt: string
}

export function createUser(db: DB, input: {
  email: string
  passwordHash: string
  name: string
}) {
  const now = new Date().toISOString()
  const result = db.insert(users).values({
    email: input.email,
    passwordHash: input.passwordHash,
    name: input.name,
    createdAt: now,
    updatedAt: now,
  }).returning().get()
  return result as unknown as UserRow
}

export function findUserByEmail(db: DB, email: string) {
  const result = db.select().from(users).where(eq(users.email, email)).get()
  return result as unknown as UserRow | undefined
}

export function findUserById(db: DB, id: number) {
  const result = db.select().from(users).where(eq(users.id, id)).get()
  return result as unknown as UserRow | undefined
}

export function saveRefreshToken(
  db: DB,
  input: { userId: number; tokenHash: string; expiresAt: string },
) {
  const now = new Date().toISOString()
  db.insert(refreshTokens).values({
    userId: input.userId,
    tokenHash: input.tokenHash,
    expiresAt: input.expiresAt,
    createdAt: now,
  }).run()
}

export function findRefreshTokenByHash(db: DB, tokenHash: string) {
  const result = db.select().from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .get()
  return result
}

export function deleteRefreshToken(db: DB, id: number) {
  db.delete(refreshTokens).where(eq(refreshTokens.id, id)).run()
}
