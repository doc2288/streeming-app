import { config as loadEnv } from 'dotenv'
import { z } from 'zod'

loadEnv()

const EnvSchema = z.object({
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(8),
  REFRESH_SECRET: z.string().min(8),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_EXPIRES_IN: z.string().default('30d'),
  REDIS_URL: z.string().optional(),
  CORS_ORIGIN: z.string().optional()
})

export const env = EnvSchema.parse(process.env)
