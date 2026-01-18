import z from 'zod'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

export function isValidISODateOnly(value: string): boolean {
  if (!dateRegex.test(value)) {
    return false
  }

  const parts = value.split('-')
  if (parts.length !== 3) {
    return false
  }

  const y = Number(parts[0])
  const m = Number(parts[1])
  const d = Number(parts[2])

  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) {
    return false
  }

  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
}

function hasMaxTwoDecimals(value: number): boolean {
  const cents = Math.round(value * 100)
  return Math.abs(value - cents / 100) < Number.EPSILON
}

const categoryIdSchema = z
  .number()
  .int('categoryId must be an integer')
  .positive('categoryId must be positive')

const amountSchema = z
  .number()
  .positive('Amount must be a positive number')
  .max(99999999.99, 'Amount must be <= 99999999.99') // DECIMAL(10,2)
  .refine(hasMaxTwoDecimals, 'Amount must have at most 2 decimal places')

const dateOnlySchema = z
  .string()
  .refine(isValidISODateOnly, 'Date must be a valid YYYY-MM-DD value')

const transactionTypeSchema = z.enum(['income', 'expense'], {
  message: "Type must be either 'income' or 'expense'",
})

export const createTransactionSchema = z.object({
  categoryId: categoryIdSchema,
  amount: amountSchema,
  date: dateOnlySchema, // <-- accept "YYYY-MM-DD"
  type: transactionTypeSchema,
  description: z.string().nullable().optional(),
})

export const updateTransactionSchema = z
  .object({
    categoryId: categoryIdSchema.optional(),
    amount: amountSchema.optional(),
    date: dateOnlySchema.optional(),
    type: transactionTypeSchema.optional(),
    description: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })

export const getTransactionsQuerySchema = z.object({
  type: transactionTypeSchema.optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  startDate: z.string().refine(isValidISODateOnly, 'startDate must be YYYY-MM-DD').optional(),
  endDate: z.string().refine(isValidISODateOnly, 'endDate must be YYYY-MM-DD').optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
})
