import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { ZodError, type ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validateData = schema.parse(req.body)
      req.body = validateData
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }))

        throw new AppError(JSON.stringify(errorMessages), 400)
      }
      throw error
    }
  }
}
