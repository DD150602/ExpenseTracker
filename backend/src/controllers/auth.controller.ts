import type { Request, Response } from 'express'
import { env } from '../config/env'
import { type AuthServcice, authService } from '../services/auth.service'
import type { RegisterInput } from '../types'
import { asyncHandler } from '../utils/asyncHandler'

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

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body as RegisterInput)
    res.cookie('token', result.token, {
      httpOnly: env.COOKIE_HTTP_ONLY,
      secure: env.COOKIE_SECURE,
      sameSite: 'strict',
      maxAge: env.COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    })
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        userId: result.userId,
        token: result.token,
      },
    })
  })
}

export const authController = new AuthController(authService)
