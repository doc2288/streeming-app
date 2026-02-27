import type { FastifyInstance } from 'fastify'
import { pool } from '../db'

export async function registerHealthRoutes (app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    let db = false
    try {
      await pool.query('SELECT 1')
      db = true
    } catch {
      // db not reachable
    }
    return { status: 'ok', db, uptime: process.uptime() }
  })
}
