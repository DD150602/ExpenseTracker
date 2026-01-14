import { z } from 'zod'

// Schema for creating a new category
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be at most 100 characters')
    .trim(),
  type: z.enum(['income', 'expense'], "Type must be either 'income' or 'expense'"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code (e.g., #667eea)')
    .optional()
    .default('#667eea'),
})

// Schema for updating a category
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be at most 100 characters')
    .trim()
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code (e.g., #667eea)')
    .optional(),
})
