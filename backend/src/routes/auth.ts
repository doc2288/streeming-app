import { FastifyInstance } from 'fastify'
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

async function createAndStoreRefreshToken(userId: string, refreshSecret: string): Promise<string> {
  const refreshToken = cryptoRandom()
  const expiresAt = new Date(Date.now() + parseDuration(env.REFRESH_EXPIRES_IN))
  await pool.query(
    'insert into refresh_tokens (user_id, token, expires_at) values ($1, $2, $3)',
    [userId, refreshToken, expiresAt.toISOString()]
  )
  return refreshToken
}

function parseDuration(value: string): number {
  // naive: supports m,h,d
  const match = /^([0-9]+)([mhd])$/.exec(value)
  if (!match) return 0
  const amount = Number(match[1])
  const unit = match[2]
  switch (unit) {
    case 'm': return amount * 60 * 1000
    case 'h': return amount * 60 * 60 * 1000
    case 'd': return amount * 24 * 60 * 60 * 1000
    default: return 0
  }
}

function cryptoRandom(): string {
  return randomBytes(32).toString('hex')
}

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  app.post('/auth/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { email, password } = parsed.data

    const existing = await pool.query('select id from users where email=$1', [email.toLowerCase()])
    if (existing.rowCount && existing.rowCount > 0) {
      return reply.code(409).send({ error: 'User already exists' })
    }

    const passwordHash = await hashPassword(password)
    const insert = await pool.query(
      'insert into users (email, password_hash) values ($1, $2) returning id, email, role',
      [email.toLowerCase(), passwordHash]
    )
    const user = insert.rows[0]
    const accessToken = app.jwt.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: env.JWT_EXPIRES_IN })
    const refreshToken = await createAndStoreRefreshToken(user.id, env.REFRESH_SECRET)
    return reply.send({ accessToken, refreshToken, user })
  })

  app.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { email, password } = parsed.data
    const result = await pool.query('select id, email, password_hash, role from users where email=$1', [email.toLowerCase()])
    if (result.rowCount === 0) {
      return reply.code(401).send({ error: 'Invalid credentials' })
    }
    const user = result.rows[0]
    const ok = await verifyPassword(password, user.password_hash)
    if (!ok) {
      return reply.code(401).send({ error: 'Invalid credentials' })
    }
    const accessToken = app.jwt.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: env.JWT_EXPIRES_IN })
    const refreshToken = await createAndStoreRefreshToken(user.id, env.REFRESH_SECRET)
    return reply.send({ accessToken, refreshToken, user })
  })

  app.post('/auth/refresh', async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { refreshToken } = parsed.data
    const res = await pool.query(
      'select user_id, expires_at from refresh_tokens where token=$1 order by created_at desc limit 1',
      [refreshToken]
    )
    if (res.rowCount === 0) {
      return reply.code(401).send({ error: 'Invalid refresh token' })
    }
    const row = res.rows[0]
    if (new Date(row.expires_at) < new Date()) {
      return reply.code(401).send({ error: 'Refresh token expired' })
    }
    const userRes = await pool.query('select id, email, role from users where id=$1', [row.user_id])
    if (userRes.rowCount === 0) {
      return reply.code(401).send({ error: 'User not found' })
    }
    const user = userRes.rows[0]
    const accessToken = app.jwt.sign({ sub: user.id, email: user.email, role: user.role }, { expiresIn: env.JWT_EXPIRES_IN })
    const newRefreshToken = await createAndStoreRefreshToken(user.id, env.REFRESH_SECRET)
    return reply.send({ accessToken, refreshToken: newRefreshToken })
  })

  app.get('/auth/me', { preHandler: [app.authenticate] }, async (request) => {
    return { user: request.user }
  })
}
