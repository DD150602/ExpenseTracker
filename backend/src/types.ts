import type { z } from 'zod'
import type { loginSchema, registerSchema } from './schemas/user.schema'

export interface User {
  user_id: number
  user_username: string
  user_email: string
  user_password: string
  user_created_at: Date
  user_updated_at: Date
}

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
