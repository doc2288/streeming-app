import type { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { pool } from '../db'
import { generateStreamKey } from '../utils/streams'

const createStreamSchema = z.object({
  title: z.string().min(3).max(120)
})

const idParamSchema = z.object({
  id: z.string().uuid()
})

const INGEST_BASE = 'rtmp://localhost/live'

export async function registerStreamRoutes (app: FastifyInstance): Promise<void> {
  app.get('/streams', async (request: FastifyRequest) => {
    let userId: string | null = null
    try {
      await request.jwtVerify()
      userId = request.user?.sub ?? null
    } catch {
      // anonymous — no token or invalid token
    }
    const res = await pool.query(
      'SELECT id, title, status, ingest_url, stream_key, user_id, created_at FROM streams ORDER BY created_at DESC'
    )
    const streams = res.rows.map((s: Record<string, unknown>) => ({
      id: s.id,
      title: s.title,
      status: s.status,
      ingest_url: s.user_id === userId ? s.ingest_url : null,
      stream_key: s.user_id === userId ? s.stream_key : null,
      user_id: s.user_id,
      created_at: s.created_at
    }))
    return { streams }
  })

  app.post('/streams', { preHandler: [app.authenticate] }, async (request, reply) => {
    const parsed = createStreamSchema.safeParse(request.body)
    if (!parsed.success) {
      return await reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { title } = parsed.data
    const key = generateStreamKey()
    const ingestUrl = `${INGEST_BASE}/${request.user.sub}`
    const res = await pool.query(
      'INSERT INTO streams (user_id, title, status, ingest_url, stream_key) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [request.user.sub, title, 'offline', ingestUrl, key]
    )
    return { stream: res.rows[0] }
  })

  app.post('/streams/:id/start', { preHandler: [app.authenticate] }, async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) return await reply.code(400).send({ error: params.error.flatten() })

    const stream = await pool.query('SELECT * FROM streams WHERE id=$1', [params.data.id])
    if (stream.rowCount === 0) return await reply.code(404).send({ error: 'Stream not found' })

    const record = stream.rows[0]
    if (record.user_id !== request.user.sub && request.user.role !== 'admin') {
      return await reply.code(403).send({ error: 'Forbidden' })
    }
    const newKey = generateStreamKey()
    const updated = await pool.query(
      'UPDATE streams SET status=$1, stream_key=$2, updated_at=now() WHERE id=$3 RETURNING *',
      ['live', newKey, params.data.id]
    )
    return { stream: updated.rows[0] }
  })

  app.post('/streams/:id/stop', { preHandler: [app.authenticate] }, async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) return await reply.code(400).send({ error: params.error.flatten() })

    const stream = await pool.query('SELECT * FROM streams WHERE id=$1', [params.data.id])
    if (stream.rowCount === 0) return await reply.code(404).send({ error: 'Stream not found' })

    const record = stream.rows[0]
    if (record.user_id !== request.user.sub && request.user.role !== 'admin') {
      return await reply.code(403).send({ error: 'Forbidden' })
    }
    const updated = await pool.query(
      'UPDATE streams SET status=$1, updated_at=now() WHERE id=$2 RETURNING *',
      ['offline', params.data.id]
    )
    return { stream: updated.rows[0] }
  })

  app.delete('/streams/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) return await reply.code(400).send({ error: params.error.flatten() })

    const stream = await pool.query('SELECT user_id FROM streams WHERE id=$1', [params.data.id])
    if (stream.rowCount === 0) return await reply.code(404).send({ error: 'Stream not found' })

    const record = stream.rows[0]
    if (record.user_id !== request.user.sub && request.user.role !== 'admin') {
      return await reply.code(403).send({ error: 'Forbidden' })
    }
    await pool.query('DELETE FROM streams WHERE id=$1', [params.data.id])
    return await reply.send({ ok: true })
  })
}
