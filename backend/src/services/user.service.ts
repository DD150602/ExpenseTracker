import { type UserModel, userModel } from '../models/user.model'
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
}

export const userService = new UserService(userModel)
