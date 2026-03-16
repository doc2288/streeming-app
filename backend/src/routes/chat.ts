import type { FastifyInstance } from 'fastify'
import type { SocketStream } from '@fastify/websocket'
import websocket from '@fastify/websocket'
import { pool } from '../db'

interface Client {
  socket: SocketStream
  userId: string | null
  userName: string | null
  lastMessageAt: number
  ready: boolean
}

const MAX_MESSAGE_LENGTH = 500
const rooms = new Map<string, Set<Client>>()

async function isStreamExists (streamId: string): Promise<boolean> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(streamId)) return false
  const res = await pool.query('SELECT id FROM streams WHERE id=$1', [streamId])
  return res.rowCount !== null && res.rowCount > 0
}

async function isBanned (streamId: string, userId: string): Promise<boolean> {
  const res = await pool.query(
    'SELECT id FROM chat_bans WHERE stream_id=$1 AND user_id=$2',
    [streamId, userId]
  )
  return res.rowCount !== null && res.rowCount > 0
}

async function getStreamSlowMode (streamId: string): Promise<number> {
  const res = await pool.query('SELECT settings FROM streams WHERE id=$1', [streamId])
  if (res.rowCount === null || res.rowCount === 0) return 0
  try {
    const settings = res.rows[0].settings as string | Record<string, unknown>
    const parsed = typeof settings === 'string' ? JSON.parse(settings) as Record<string, unknown> : settings
    return typeof parsed.chat_slow_mode === 'number' ? parsed.chat_slow_mode : 0
  } catch {
    return 0
  }
}

export async function registerChatRoutes (app: FastifyInstance): Promise<void> {
  if (!app.hasRequestDecorator('ws')) {
    await app.register(websocket)
  }

  app.get('/chat/:streamId', { websocket: true }, (connection, req) => {
    const params = req.params as { streamId?: string }
    const streamId = params.streamId ?? ''

    let userId: string | null = null
    let userName: string | null = null
    try {
      const url = new URL(req.url, 'http://localhost')
      const token = url.searchParams.get('token')
      if (token != null) {
        const decoded = app.jwt.verify<{ sub: string, email: string }>(token)
        userId = decoded.sub
        userName = decoded.email.split('@')[0]
      }
    } catch {
      // anonymous connection — read-only
    }

    let room = rooms.get(streamId)
    if (room == null) {
      room = new Set()
      rooms.set(streamId, room)
    }
    const client: Client = { socket: connection, userId, userName, lastMessageAt: 0, ready: false }
    const currentRoom = room
    currentRoom.add(client)

    const pendingMessages: Buffer[] = []

    void (async () => {
      const exists = await isStreamExists(streamId)
      if (!exists) {
        connection.socket.close(4004, 'Stream not found')
        return
      }

      if (userId != null) {
        const banned = await isBanned(streamId, userId)
        if (banned) {
          connection.socket.close(4003, 'Banned from chat')
          return
        }
      }

      client.ready = true

      for (const raw of pendingMessages) {
        await processMessage(raw, client, streamId, currentRoom, connection)
      }
      pendingMessages.length = 0
    })()

    connection.socket.on('message', (raw: Buffer) => {
      if (!client.ready) {
        pendingMessages.push(raw)
        return
      }
      void processMessage(raw, client, streamId, currentRoom, connection)
    })

    connection.socket.on('close', () => {
      currentRoom.delete(client)
      if (currentRoom.size === 0) rooms.delete(streamId)
    })

    connection.socket.on('error', () => {
      currentRoom.delete(client)
    })
  })
}

async function processMessage (
  raw: Buffer,
  client: Client,
  streamId: string,
  room: Set<Client>,
  connection: SocketStream
): Promise<void> {
  const { userId, userName } = client
  if (userId == null) return

  try {
    const slowMode = await getStreamSlowMode(streamId)
    if (slowMode > 0) {
      const elapsed = Date.now() - client.lastMessageAt
      if (elapsed < slowMode * 1000) return
    }

    const banned = await isBanned(streamId, userId)
    if (banned) {
      connection.socket.close(4003, 'Banned from chat')
      return
    }
  } catch {
    return
  }

  const payload = raw.toString().trim()
  if (payload.length === 0 || payload.length > MAX_MESSAGE_LENGTH) return

  client.lastMessageAt = Date.now()
  const msg = { userId, userName, message: payload, ts: Date.now() }
  const json = JSON.stringify(msg)
  room.forEach((c) => {
    try { c.socket.socket.send(json) } catch { /* disconnected */ }
  })
}
