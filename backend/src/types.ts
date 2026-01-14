import type { z } from 'zod'
import type { loginSchema, registerSchema } from './schemas/user.schema'
import type { createCategorySchema, updateCategorySchema } from './schemas/category.schema'

export interface User {
  user_id: number
  user_username: string
  user_email: string
  user_password: string
  user_created_at: Date
  user_updated_at: Date
}

export type UserName = Pick<User, 'user_id' | 'user_username'>

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

export interface Category {
  category_id: number
  category_user_id: number
  category_name: string
  category_type: 'income' | 'expense'
  category_color: string
  category_created_at: Date
}

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
