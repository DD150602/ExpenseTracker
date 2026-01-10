import { AppError } from '../utils/AppError'
import type { Response, Request, NextFunction } from 'express'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError){
    return res.status(err.statusCode).json({
      success: false,
      message: JSON.parse(err.message),
    })
  }
  console.error('ERROR: ', err)
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}
