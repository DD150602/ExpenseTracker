import type { NextFunction, Request, Response } from 'express'

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>

/**
 * Wrapper for async route handlers that catches errors automatically
 * and passes them to Express error handling middleware
 *
 * @param fn - Async function to wrap
 * @returns Express middleware function
 *
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await userService.getAll()
 *   res.json(users)
 * }))
 */
export const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
