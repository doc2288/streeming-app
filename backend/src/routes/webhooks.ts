import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { pool } from '../db'

const webhookSchema = z.object({
  name: z.string().min(1)
})

async function updateStreamStatus (publishName: string, status: 'live' | 'offline'): Promise<number> {
  const res = await pool.query(
    'UPDATE streams SET status=$1, updated_at=now() WHERE stream_key=$2 OR id::text=$2',
    [status, publishName]
  )
  return res.rowCount ?? 0
}

export async function registerWebhookRoutes (app: FastifyInstance): Promise<void> {
  app.post('/api/webhooks/stream-start', async (request, reply) => {
    const parsed = webhookSchema.safeParse(request.body)
    if (!parsed.success) {
      return await reply.code(400).send({ error: 'Expected form field name=<streamId>' })
    }
    const updated = await updateStreamStatus(parsed.data.name, 'live')
    if (updated === 0) return await reply.code(404).send({ error: 'Stream not found' })
    return await reply.send({ ok: true, updated })
  })

  app.post('/api/webhooks/stream-stop', async (request, reply) => {
    const parsed = webhookSchema.safeParse(request.body)
    if (!parsed.success) {
      return await reply.code(400).send({ error: 'Expected form field name=<streamId>' })
    }
    const updated = await updateStreamStatus(parsed.data.name, 'offline')
    if (updated === 0) return await reply.code(404).send({ error: 'Stream not found' })
    return await reply.send({ ok: true, updated })
  })
}
<<<<<<< HEAD
=======

>>>>>>> bcebf11 (refactor: unify stream ingest URL and key handling; add webhook routes for stream status updates)
