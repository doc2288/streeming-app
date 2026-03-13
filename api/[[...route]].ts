import type { IncomingMessage, ServerResponse } from 'http'
import type { FastifyInstance } from 'fastify'
import { createApp } from '../backend/src/app'

let appPromise: Promise<FastifyInstance> | null = null

async function getApp (): Promise<FastifyInstance> {
  if (appPromise == null) {
    appPromise = (async () => {
      const app = await createApp()
      await app.ready()
      return app
    })()
  }
  return await appPromise
}

function stripApiPrefix (url: string | undefined): string {
  if (url == null || url === '') return '/'
  if (url === '/api') return '/'
  if (url.startsWith('/api/')) return url.slice('/api'.length)
  return url
}

export default async function handler (
  req: IncomingMessage & { url?: string },
  res: ServerResponse
): Promise<void> {
  const app = await getApp()
  req.url = stripApiPrefix(req.url)
  app.server.emit('request', req, res)
}
