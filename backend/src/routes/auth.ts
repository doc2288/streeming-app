import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { pool } from '../db'
import { hashPassword, verifyPassword } from '../utils/password'
import { env } from '../config/env'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const loginSchema = registerSchema

const refreshSchema = z.object({
  refreshToken: z.string().min(10)
})

async function createAndStoreRefreshToken (userId: string): Promise<string> {
  const refreshToken = cryptoRandom()
  const expiresAt = new Date(Date.now() + parseDuration(env.REFRESH_EXPIRES_IN))
  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [userId, refreshToken, expiresAt.toISOString()]
  )
  return refreshToken
}

function parseDuration (value: string): number {
  const match = /^([0-9]+)([smhd])$/.exec(value)
  if (!match) return 30 * 24 * 60 * 60 * 1000 // fallback: 30 days
  const amount = Number(match[1])
  const unit = match[2]
  switch (unit) {
    case 's': return amount * 1000
    case 'm': return amount * 60 * 1000
    case 'h': return amount * 60 * 60 * 1000
    case 'd': return amount * 24 * 60 * 60 * 1000
    default: return 30 * 24 * 60 * 60 * 1000
  }
}

function cryptoRandom (): string {
  return randomBytes(32).toString('hex')
}

function sanitizeUser (row: Record<string, unknown>): { id: string, email: string, role: string } {
  return { id: row.id as string, email: row.email as string, role: row.role as string }
}

export async function registerAuthRoutes (app: FastifyInstance): Promise<void> {
  app.post('/auth/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) {
      return await reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { email, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [normalizedEmail])
    if (existing.rowCount !== null && existing.rowCount > 0) {
      return await reply.code(409).send({ error: 'User already exists' })
    }

    const passwordHash = await hashPassword(password)
    const insert = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, role',
      [normalizedEmail, passwordHash]
    )
    const user = sanitizeUser(insert.rows[0])
    const accessToken = app.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: env.JWT_EXPIRES_IN }
    )
    const refreshToken = await createAndStoreRefreshToken(user.id)
    return await reply.send({ accessToken, refreshToken, user })
  })

  app.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return await reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { email, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()
    const result = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email=$1',
      [normalizedEmail]
    )
    if (result.rowCount === 0) {
      return await reply.code(401).send({ error: 'Invalid credentials' })
    }
    const row = result.rows[0]
    const ok = await verifyPassword(password, row.password_hash)
    if (!ok) {
      return await reply.code(401).send({ error: 'Invalid credentials' })
    }
    const user = sanitizeUser(row)
    const accessToken = app.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: env.JWT_EXPIRES_IN }
    )
    const refreshToken = await createAndStoreRefreshToken(user.id)
    return await reply.send({ accessToken, refreshToken, user })
  })

  app.post('/auth/refresh', async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body)
    if (!parsed.success) {
      return await reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { refreshToken } = parsed.data

    const res = await pool.query(
      'DELETE FROM refresh_tokens WHERE token=$1 RETURNING user_id, expires_at',
      [refreshToken]
    )
    if (res.rowCount === 0) {
      return await reply.code(401).send({ error: 'Invalid refresh token' })
    }
    const row = res.rows[0]
    if (new Date(row.expires_at) < new Date()) {
      return await reply.code(401).send({ error: 'Refresh token expired' })
    }

    const userRes = await pool.query('SELECT id, email, role FROM users WHERE id=$1', [row.user_id])
    if (userRes.rowCount === 0) {
      return await reply.code(401).send({ error: 'User not found' })
    }
    const user = sanitizeUser(userRes.rows[0])
    const accessToken = app.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { expiresIn: env.JWT_EXPIRES_IN }
    )
    const newRefreshToken = await createAndStoreRefreshToken(user.id)
    return await reply.send({ accessToken, refreshToken: newRefreshToken, user })
  })

  app.post('/auth/logout', { preHandler: [app.authenticate] }, async (request, reply) => {
    const body = request.body as { refreshToken?: string } | undefined
    if (body?.refreshToken) {
      await pool.query(
        'DELETE FROM refresh_tokens WHERE token=$1 AND user_id=$2',
        [body.refreshToken, request.user.sub]
      )
    }
    return await reply.send({ ok: true })
  })

  app.get('/auth/me', { preHandler: [app.authenticate] }, async (request) => {
    return { user: request.user }
  })
}
