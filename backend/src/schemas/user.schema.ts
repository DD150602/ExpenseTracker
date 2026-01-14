import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6).max(100),
})

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
})

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.email().optional()
}).refine(
  (data) => data.username || data.email,
  { message: 'At least one field (username or email) must be provided' }
)
