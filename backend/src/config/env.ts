import { z } from 'zod'
import 'dotenv/config'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_EXPIRES_DAYS: z.string().transform(Number),
  COOKIE_SECURE: z.string().transform((val) => val === 'true'),
  COOKIE_HTTP_ONLY: z.string().transform((val) => val === 'true'),
  FRONTEND_URL: z.string(),
})

export const env = envSchema.parse(process.env)
