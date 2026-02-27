import type { FastifyInstance } from 'fastify'
import websocket from '@fastify/websocket'

interface Client {
  socket: websocket.SocketStream
  userId: string | null
}

const MAX_MESSAGE_LENGTH = 500
const rooms = new Map<string, Set<Client>>()

export async function registerChatRoutes (app: FastifyInstance): Promise<void> {
  if (!app.hasRequestDecorator('ws')) {
    await app.register(websocket)
  }

  app.get('/chat/:streamId', { websocket: true }, (connection, req) => {
    const streamId = (req.params as any).streamId as string
    const userId = (req as any).user?.sub ?? null

    let room = rooms.get(streamId)
    if (room == null) {
      room = new Set()
      rooms.set(streamId, room)
    }
    const client: Client = { socket: connection, userId }
    room.add(client)

    connection.socket.on('message', (raw: Buffer) => {
      const payload = raw.toString().trim()
      if (payload.length === 0 || payload.length > MAX_MESSAGE_LENGTH) return

      const msg = { userId, message: payload, ts: Date.now() }
      const json = JSON.stringify(msg)
      room?.forEach((c) => {
        try {
          c.socket.socket.send(json)
        } catch {
          // client disconnected
        }
      })
    })

    connection.socket.on('close', () => {
      room?.delete(client)
      if (room != null && room.size === 0) rooms.delete(streamId)
    })

    connection.socket.on('error', () => {
      room?.delete(client)
    })
  })
}
