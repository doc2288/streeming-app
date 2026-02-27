import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { pool } from '../db'
import { generateStreamKey } from '../utils/streams'

const createStreamSchema = z.object({
  title: z.string().min(3)
})

const idParamSchema = z.object({
  id: z.string().uuid()
})

const INGEST_BASE = 'rtmp://localhost/live'

export async function registerStreamRoutes(app: FastifyInstance): Promise<void> {
  app.get('/streams', async () => {
    const res = await pool.query('select id, title, status, ingest_url, stream_key, user_id from streams order by created_at desc')
    return { streams: res.rows }
  })

  app.post('/streams', { preHandler: [app.authenticate] }, async (request, reply) => {
    const parsed = createStreamSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { title } = parsed.data
    const key = generateStreamKey()
    const ingestUrl = `${INGEST_BASE}/${request.user.sub}`
    const res = await pool.query(
      'insert into streams (user_id, title, status, ingest_url, stream_key) values ($1, $2, $3, $4, $5) returning *',
      [request.user.sub, title, 'offline', ingestUrl, key]
    )
    return { stream: res.rows[0] }
  })

  app.post('/streams/:id/start', { preHandler: [app.authenticate] }, async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) return reply.code(400).send({ error: params.error.flatten() })
    const stream = await pool.query('select * from streams where id=$1', [params.data.id])
    if (stream.rowCount === 0) return reply.code(404).send({ error: 'Stream not found' })
    const record = stream.rows[0]
    if (record.user_id !== request.user.sub && request.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden' })
    }
    const newKey = generateStreamKey()
    const updated = await pool.query(
      'update streams set status=$1, stream_key=$2, updated_at=now() where id=$3 returning *',
      ['live', newKey, params.data.id]
    )
    return { stream: updated.rows[0] }
  })

  app.post('/streams/:id/stop', { preHandler: [app.authenticate] }, async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) return reply.code(400).send({ error: params.error.flatten() })
    const stream = await pool.query('select * from streams where id=$1', [params.data.id])
    if (stream.rowCount === 0) return reply.code(404).send({ error: 'Stream not found' })
    const record = stream.rows[0]
    if (record.user_id !== request.user.sub && request.user.role !== 'admin') {
      return reply.code(403).send({ error: 'Forbidden' })
    }
    const updated = await pool.query(
      'update streams set status=$1, updated_at=now() where id=$2 returning *',
      ['offline', params.data.id]
    )
    return { stream: updated.rows[0] }
  })
}
