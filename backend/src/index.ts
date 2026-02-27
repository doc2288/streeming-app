import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import websocket from '@fastify/websocket'
import { env } from './config/env'
import { migrate, pool } from './db'
import { registerHealthRoutes } from './routes/health'
import { registerAuthRoutes } from './routes/auth'
import { registerStreamRoutes } from './routes/streams'
import { registerChatRoutes } from './routes/chat'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any
  }
  interface FastifyRequest {
    user: {
      sub: string
      email: string
      role: string
      iat: number
      exp: number
    }
  }
}

async function bootstrap(): Promise<void> {
  const app = Fastify({ logger: true })

  await app.register(cors, { origin: env.CORS_ORIGIN ?? true })
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })
  await app.register(jwt, { secret: env.JWT_SECRET })
  await app.register(websocket)

  app.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  await migrate()

  await registerHealthRoutes(app)
  await registerAuthRoutes(app)
  await registerStreamRoutes(app)
  await registerChatRoutes(app)

  const port = env.PORT
  app.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
  })

  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM']
  signals.forEach((sig) => {
    process.on(sig, async () => {
      await app.close()
      await pool.end()
      process.exit(0)
    })
  })
}

void bootstrap()
