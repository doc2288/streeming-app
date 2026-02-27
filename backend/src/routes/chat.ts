import { FastifyInstance } from 'fastify'
import websocket from '@fastify/websocket'

type Client = { socket: websocket.SocketStream, userId: string | null }
const rooms = new Map<string, Set<Client>>()

export async function registerChatRoutes(app: FastifyInstance): Promise<void> {
  if (!app.hasDecorator('ws')) {
    app.register(websocket)
  }

  app.get('/chat/:streamId', { websocket: true }, (connection, req) => {
    const streamId = (req.params as any).streamId as string
    const userId = (req as any).user?.sub ?? null
    let room = rooms.get(streamId)
    if (!room) {
      room = new Set()
      rooms.set(streamId, room)
    }
    const client: Client = { socket: connection, userId }
    room.add(client)

    connection.socket.on('message', (raw: Buffer) => {
      const payload = raw.toString()
      const msg = { userId, message: payload, ts: Date.now() }
      room?.forEach((c) => {
        c.socket.socket.send(JSON.stringify(msg))
      })
    })

    connection.socket.on('close', () => {
      room?.delete(client)
      if (room && room.size === 0) rooms.delete(streamId)
    })
  })
}
