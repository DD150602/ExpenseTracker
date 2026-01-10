/**
 * Custom error class for operational errors
 * Extends the built-in Error class with additional properties
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  /**
   * Creates an AppError instance
   * @param message - Error message to display
   * @param statusCode - HTTP status code (400, 404, 500, etc.)
   * @param isOperational - Whether this is an expected error (default: true)
   */
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}
