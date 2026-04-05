import { resolve } from 'path'
import { createWriteStream } from 'fs'
import { mkdir } from 'fs/promises'
import { pipeline } from 'stream/promises'
import { randomBytes } from 'crypto'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { pool } from '../db'
import { env } from '../config/env'
import { generateStreamKey } from '../utils/streams'

const QUALITIES = ['1080p', '720p', '480p', '360p', 'source'] as const
const createStreamSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(500).optional().default(''),
  category: z.string().max(50).optional().default('other'),
  language: z.string().max(10).optional().default('ua'),
  tags: z.array(z.string().max(30)).max(5).optional().default([]),
  max_quality: z.enum(QUALITIES).optional().default('1080p'),
  delay_seconds: z.coerce.number().int().min(0).max(900).optional().default(0),
  mature_content: z.boolean().optional().default(false),
  chat_followers_only: z.boolean().optional().default(false),
  chat_slow_mode: z.coerce.number().int().min(0).max(300).optional().default(0)
})

const updateSettingsSchema = z.object({
  max_quality: z.enum(QUALITIES).optional(),
  delay_seconds: z.coerce.number().int().min(0).max(900).optional(),
  mature_content: z.boolean().optional(),
  chat_followers_only: z.boolean().optional(),
  chat_slow_mode: z.coerce.number().int().min(0).max(300).optional()
})

const idParamSchema = z.object({
  id: z.string().uuid()
})

const DEFAULT_SETTINGS = { max_quality: '1080p', delay_seconds: 0, mature_content: false, chat_followers_only: false, chat_slow_mode: 0 }

function parseSettings (raw: unknown): typeof DEFAULT_SETTINGS {
  if (typeof raw !== 'string' || raw === '') return { ...DEFAULT_SETTINGS }
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } } catch { return { ...DEFAULT_SETTINGS } }
}

function sanitizeStream (row: Record<string, unknown>, requestUserId: string | null): Record<string, unknown> {
  const isOwner = row.user_id === requestUserId
  const { stream_key: streamKey, ingest_url: ingestUrl, ...safe } = row
  return {
    ...safe,
    stream_key: isOwner ? streamKey : null,
    ingest_url: isOwner ? ingestUrl : null
  }
}

export async function registerStreamRoutes (app: FastifyInstance): Promise<void> {
  app.get('/streams', async (request: FastifyRequest) => {
    let userId: string | null = null
    try {
      await request.jwtVerify()
      userId = request.user?.sub ?? null
    } catch {
      // anonymous — no token or invalid token
    }
    const query = request.query as Record<string, string | undefined>
    const parsedLimit = parseInt(query.limit ?? '50', 10)
    const parsedOffset = parseInt(query.offset ?? '0', 10)
    const limit = Math.min(Math.max(Number.isNaN(parsedLimit) ? 50 : parsedLimit, 1), 100)
    const offset = Math.max(Number.isNaN(parsedOffset) ? 0 : parsedOffset, 0)
    const res = await pool.query(
      'SELECT id, title, description, category, language, tags, settings, status, ingest_url, stream_key, thumbnail_url, user_id, created_at FROM streams ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    )
    const streams = res.rows.map((s: Record<string, unknown>) => {
      const settings = parseSettings(s.settings)
      return {
        id: s.id,
        title: s.title,
        description: s.description ?? '',
        category: s.category ?? 'other',
        language: s.language ?? 'ua',
        tags: typeof s.tags === 'string' && s.tags !== '' ? (s.tags).split(',') : [],
        settings,
        status: s.status,
        thumbnail_url: s.thumbnail_url ?? null,
        ingest_url: s.user_id === userId ? s.ingest_url : null,
        stream_key: s.user_id === userId ? s.stream_key : null,
        user_id: s.user_id,
        created_at: s.created_at
      }
    })
    return { streams }
  })

  app.post('/streams', { preHandler: [app.authenticate] }, async (request, reply) => {
    const parsed = createStreamSchema.safeParse(request.body)
    if (!parsed.success) {
      return await reply.code(400).send({ error: parsed.error.flatten() })
    }
    const { title, description, category, language, tags, max_quality: maxQuality, delay_seconds: delaySeconds, mature_content: matureContent, chat_followers_only: chatFollowersOnly, chat_slow_mode: chatSlowMode } = parsed.data
    const tagsStr = tags.join(',')
    const settings = JSON.stringify({ max_quality: maxQuality, delay_seconds: delaySeconds, mature_content: matureContent, chat_followers_only: chatFollowersOnly, chat_slow_mode: chatSlowMode })
    const created = await pool.query(
      'INSERT INTO streams (user_id, title, description, category, language, tags, settings, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [request.user.sub, title, description, category, language, tagsStr, settings, 'offline']
    )
    const streamId = created.rows[0].id as string
    const streamKey = generateStreamKey()
    const ingestUrl = `${env.RTMP_INGEST_BASE_URL}/${streamId}`
    const updated = await pool.query(
      'UPDATE streams SET ingest_url=$1, stream_key=$2, updated_at=now() WHERE id=$3 RETURNING *',
      [ingestUrl, streamKey, streamId]
    )
    return { stream: sanitizeStream(updated.rows[0] as Record<string, unknown>, request.user.sub) }
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
    const updated = await pool.query(
      'UPDATE streams SET status=$1, updated_at=now() WHERE id=$2 RETURNING *',
      ['live', params.data.id]
    )
    return { stream: sanitizeStream(updated.rows[0] as Record<string, unknown>, request.user.sub) }
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
    return { stream: sanitizeStream(updated.rows[0] as Record<string, unknown>, request.user.sub) }
  })

  app.patch('/streams/:id/settings', { preHandler: [app.authenticate] }, async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) return await reply.code(400).send({ error: params.error.flatten() })
    const body = updateSettingsSchema.safeParse(request.body)
    if (!body.success) return await reply.code(400).send({ error: body.error.flatten() })

    const stream = await pool.query('SELECT user_id, settings FROM streams WHERE id=$1', [params.data.id])
    if (stream.rowCount === 0) return await reply.code(404).send({ error: 'Stream not found' })
    if (stream.rows[0].user_id !== request.user.sub) return await reply.code(403).send({ error: 'Forbidden' })

    const current = parseSettings(stream.rows[0].settings)
    const merged = { ...current, ...body.data }
    await pool.query('UPDATE streams SET settings=$1, updated_at=now() WHERE id=$2', [JSON.stringify(merged), params.data.id])
    return { settings: merged }
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

  app.post('/streams/:id/thumbnail', { preHandler: [app.authenticate] }, async (request, reply) => {
    const params = idParamSchema.safeParse(request.params)
    if (!params.success) return await reply.code(400).send({ error: params.error.flatten() })

    const stream = await pool.query('SELECT user_id FROM streams WHERE id=$1', [params.data.id])
    if (stream.rowCount === 0) return await reply.code(404).send({ error: 'Stream not found' })
    if (stream.rows[0].user_id !== request.user.sub && request.user.role !== 'admin') {
      return await reply.code(403).send({ error: 'Forbidden' })
    }

    const file = await request.file()
    if (file == null) return await reply.code(400).send({ error: 'No file uploaded' })

    const ext = file.filename.split('.').pop() ?? 'jpg'
    if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext.toLowerCase())) {
      return await reply.code(400).send({ error: 'Invalid file type. Use jpg, png, webp, or gif' })
    }

    const dir = resolve(process.cwd(), 'uploads')
    await mkdir(dir, { recursive: true })
    const fname = `${params.data.id}-${randomBytes(4).toString('hex')}.${ext}`
    const fpath = resolve(dir, fname)

    await pipeline(file.file, createWriteStream(fpath))

    const thumbUrl = `/uploads/${fname}`
    await pool.query('UPDATE streams SET thumbnail_url=$1, updated_at=now() WHERE id=$2', [thumbUrl, params.data.id])
    return { thumbnail_url: thumbUrl }
  })
}
