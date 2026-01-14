import { type UserModel, userModel } from '../models/user.model'
import type { RegisterInput } from '../types'
import { AppError } from '../utils/AppError'

export class UserService {
  constructor(private userModel: UserModel) {}

  async getUserInfo(id: number) {
    const user = await this.userModel.findById(id)
    if (!user) {
      throw new AppError('User not found', 404)
    }
    return user
  }

  async updateUserInfo(userId: number, data: Omit<RegisterInput, 'password'>) {
    if (data.username) {
      const checkUniqueUsername = await this.userModel.findByUsername(data.username)
      if (checkUniqueUsername && checkUniqueUsername.user_id !== userId) {
        throw new AppError('Username already in use', 409)
      }
    }
    if (data.email) {
      const checkUniqueEmail = await this.userModel.findByEmail(data.email)
      if (checkUniqueEmail && checkUniqueEmail.user_id !== userId) {
        throw new AppError('Email already in use', 409)
      }
    }
    const updatedUser = await this.userModel.updateUser(userId, data)
    if (!updatedUser) {
      throw new AppError('Failed to update user', 500)
    }
    return updatedUser
  }
}

export const userService = new UserService(userModel)
