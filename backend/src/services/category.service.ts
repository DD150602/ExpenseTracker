import { type CategoryModel, categoryModel } from '../models/category.model'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'
import { AppError } from '../utils/AppError'

export class CategoryService {
  constructor(private categoryModel: CategoryModel) {}

  async getCategoryById(userId: number, categoryId: number): Promise<Category> {
    const category = await this.categoryModel.findById(userId, categoryId)
    if (!category) {
      throw new AppError('Category not found', 404)
    }
    return category
  }

  async createCategory(userId: number, data: CreateCategoryInput): Promise<Category> {
    const existingCategory = await this.categoryModel.findByUserIdAndName(userId, data.name)
    if (existingCategory) {
      throw new AppError('Category with this name already exists', 409)
    }

    const category = await this.categoryModel.createCategory(userId, data)
    return category
  }

  async getUserCategories(userId: number, type?: 'income' | 'expense'): Promise<Category[]> {
    const categories = await this.categoryModel.findAllByUser(userId, type)
    return categories
  }

  async updateCategory(
    userId: number,
    categoryId: number,
    data: UpdateCategoryInput
  ): Promise<Category> {
    const category = await this.getCategoryById(userId, categoryId)

    if (data.name && data.name !== category.category_name) {
      const existingCategory = await this.categoryModel.findByUserIdAndName(userId, data.name)
      if (existingCategory && existingCategory.category_id !== categoryId) {
        throw new AppError('Category name already exists', 409)
      }
    }

    const updatedCategory = await this.categoryModel.updateCategory(userId, categoryId, data)

    return updatedCategory
  }

  async deleteCategory(userId: number, categoryId: number): Promise<void> {
    await this.getCategoryById(userId, categoryId)

    const hasTransactions = await this.categoryModel.hasTransactions(categoryId)
    if (hasTransactions) {
      throw new AppError(
        'Cannot delete category with existing transactions. Please delete or reassign transactions first.',
        400
      )
    }

    await this.categoryModel.deleteCategory(userId, categoryId)
  }
}

export const categoryService = new CategoryService(categoryModel)
