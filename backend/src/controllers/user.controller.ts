import { asyncHandler } from '../utils/asyncHandler'
import type { Request, Response } from 'express'
import { type UserService, userService } from '../services/user.service'
import { AppError } from '../utils/AppError'

export class UserController {
  constructor(private userService: UserService) {}

  getUserInfo = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req
    if (!userId) {
      throw new AppError('User ID not found', 401)
    }
    const user = await this.userService.getUserInfo(userId)
    res.status(200).json({
      success: true,
      message: 'User info retrieved successfully',
      data: {
        user,
      },
    })
  })
}

export const userController = new UserController(userService)
