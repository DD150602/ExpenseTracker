import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from '../utils/AppError'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      userId?: number
    }
  }
}

// JWT payload type
interface JwtPayload {
  userId: number
  iat: number
  exp: number
}

/**
 * Authentication middleware
 *
 * Verifies JWT token from cookies and attaches userId to the request object.
 * Protects routes by ensuring only authenticated users can access them.
 *
 * @middleware
 *
 * @param {Request} req - Express request object (expects token in cookies)
 * @param {Response} _res - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @throws {AppError} 401 - Access token not provided
 * @throws {AppError} 401 - Invalid token
 * @throws {AppError} 401 - Token expired
 *
 * @example
 * // Protect a single route
 * router.get('/profile', auth, authController.getProfile)
 *
 * @example
 * // Protect all routes in a router
 * router.use(auth)
 * router.get('/categories', categoryController.getAll)
 * router.post('/transactions', transactionController.create)
 *
 * @example
 * // Access userId in controller
 * getProfile = asyncHandler(async (req: Request, res: Response) => {
 *   const userId = req.userId // Attached by auth middleware
 *   const user = await this.userService.getProfile(userId)
 *   res.json({ user })
 * })
 */
export const auth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token

    if (!token) {
      throw new AppError('Access token not provided', 401)
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    req.userId = decoded.userId

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError('Invalid token', 401)
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expired', 401)
    }
    throw error
  }
}
