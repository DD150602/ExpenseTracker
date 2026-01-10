import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { type UserModel, userModel } from '../models/user.model'
import type { User } from '../types'
import { AppError } from '../utils/AppError'

export class AuthServcice {
  constructor(private userModel: UserModel) {}

  async login(email: string, password: string) {
    const user = await this.userModel.findByEmail(email)
    if (!user) {
      throw new AppError('Invalid Credentials', 401)
    }
    const isPasswordValid = await this.verifyPassword(password, user.user_password)
    if (!isPasswordValid) {
      throw new AppError('Invalid Credentials', 401)
    }
    const token = this.generateToken(user.user_id)

    return { user: this.sanitizeUser(user), token }
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' })
  }

  private sanitizeUser(user: User) {
    const { user_password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}

export const authService = new AuthServcice(userModel)
