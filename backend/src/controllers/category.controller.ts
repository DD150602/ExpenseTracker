import type { Request, Response } from 'express'
import { type CategoryService, categoryService } from '../services/category.service'
import { AppError } from '../utils/AppError'
import { asyncHandler } from '../utils/asyncHandler'

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId

    const category = await this.categoryService.createCategory(userId, req.body)

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    })
  })

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const { type } = req.query

    const validType =
      type === 'income' || type === 'expense' ? (type as 'income' | 'expense') : undefined

    const categories = await this.categoryService.getUserCategories(userId, validType)

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    })
  })

  getById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const categoryId = this.validateCategoryId(req.params.id)

    const category = await this.categoryService.getCategoryById(userId, categoryId)

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    })
  })

  update = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const categoryId = this.validateCategoryId(req.params.id)
    const { name, color } = req.body

    const updatedCategory = await this.categoryService.updateCategory(userId, categoryId, {
      name,
      color,
    })

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    })
  })

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const categoryId = this.validateCategoryId(req.params.id)

    await this.categoryService.deleteCategory(userId, categoryId)

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    })
  })

  private validateCategoryId(id: string | undefined): number {
    if (!id) {
      throw new AppError('Category ID is required', 400)
    }

    const categoryId = Number.parseInt(id, 10)

    if (Number.isNaN(categoryId)) {
      throw new AppError('Invalid category ID', 400)
    }

    return categoryId
  }
}

export const categoryController = new CategoryController(categoryService)
