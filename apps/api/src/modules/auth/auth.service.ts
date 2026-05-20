import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'
import crypto from 'node:crypto'
import { getDatabase } from '../../db/index'
import { httpError } from '../../shared/errors/http-error'
import * as authRepository from './auth.repository'
import type { RegisterInput, LoginInput } from './auth.schema'

const SALT_ROUNDS = 12
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev-secret-change-in-production'
}

function signToken(payload: Record<string, unknown>) {
  return sign({ ...payload, exp: Math.floor(Date.now() / 1000) + 15 * 60 }, getJwtSecret(), 'HS256')
}

function sanitizeUser(user: authRepository.UserRow) {
  const { passwordHash: _passwordHash, ...rest } = user
  return rest
}

export async function register(input: RegisterInput) {
  const db = getDatabase()

  const existing = authRepository.findUserByEmail(db, input.email)
  if (existing) {
    httpError(409, 'Email already registered')
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
  const user = authRepository.createUser(db, {
    email: input.email,
    passwordHash,
    name: input.name,
  })

  return { user: sanitizeUser(user) }
}

export async function login(input: LoginInput) {
  const db = getDatabase()

  const user = authRepository.findUserByEmail(db, input.email)
  if (!user) {
    httpError(401, 'Invalid email or password')
  }

  const passwordValid = await bcrypt.compare(input.password, user.passwordHash)
  if (!passwordValid) {
    httpError(401, 'Invalid email or password')
  }

  const accessToken = await signToken({ id: user.id, email: user.email, role: user.role, jti: crypto.randomUUID() })

  const refreshTokenRaw = crypto.randomUUID()
  const refreshTokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex')
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS).toISOString()

  authRepository.saveRefreshToken(db, {
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt,
  })

  return {
    accessToken,
    refreshToken: refreshTokenRaw,
    user: sanitizeUser(user),
  }
}

export async function refresh(refreshTokenRaw: string) {
  const db = getDatabase()

  const tokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex')
  const stored = authRepository.findRefreshTokenByHash(db, tokenHash)

  if (!stored) {
    httpError(401, 'Invalid refresh token')
  }

  if (new Date(stored.expiresAt) < new Date()) {
    authRepository.deleteRefreshToken(db, stored.id)
    httpError(401, 'Refresh token expired')
  }

  authRepository.deleteRefreshToken(db, stored.id)

  const user = authRepository.findUserById(db, stored.userId)
  if (!user) {
    httpError(401, 'User not found')
  }

  const accessToken = await signToken({ id: user.id, email: user.email, role: user.role, jti: crypto.randomUUID() })

  const newRefreshTokenRaw = crypto.randomUUID()
  const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshTokenRaw).digest('hex')
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS).toISOString()

  authRepository.saveRefreshToken(db, {
    userId: user.id,
    tokenHash: newRefreshTokenHash,
    expiresAt,
  })

  return {
    accessToken,
    refreshToken: newRefreshTokenRaw,
  }
}

export async function logout(refreshTokenRaw: string) {
  const db = getDatabase()
  const tokenHash = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex')
  const stored = authRepository.findRefreshTokenByHash(db, tokenHash)
  if (stored) {
    authRepository.deleteRefreshToken(db, stored.id)
  }
}

export async function getMe(userId: number) {
  const db = getDatabase()
  const user = authRepository.findUserById(db, userId)
  if (!user) {
    httpError(404, 'User not found')
  }
  return { user: sanitizeUser(user) }
}
