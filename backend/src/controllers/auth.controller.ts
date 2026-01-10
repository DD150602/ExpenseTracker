import { type AuthServcice, authService } from '../services/auth.service'
import { asyncHandler } from '../utils/asyncHandler'
import { env } from '../config/env'
import type { Request, Response } from 'express'

export class AuthController {
  constructor(private authService: AuthServcice) {}
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const result = await this.authService.login(email, password)
    res.cookie('token', result.token, {
      httpOnly: env.COOKIE_HTTP_ONLY,
      secure: env.COOKIE_SECURE,
      sameSite: 'strict',
      maxAge: env.COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        token: result.token,
      },
    })
  })
}

export const authController = new AuthController(authService)
