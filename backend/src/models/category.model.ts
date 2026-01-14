import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import pool from '../config/database'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '../types'
import { AppError } from '../utils/AppError'

export class CategoryModel {
  async findById(userId: number, categoryId: number): Promise<Category | null> {
    const conn = await pool.getConnection()
    try {
      const [[rows]] = await conn.execute<RowDataPacket[]>(
        'SELECT category_id, category_user_id, category_name, category_type, category_color, category_created_at FROM categories WHERE category_id = ? AND category_user_id = ?',
        [categoryId, userId]
      )
      return (rows as Category) || null
    } finally {
      conn.release()
    }
  }

  async findByUserIdAndName(userId: number, categoryName: string): Promise<Category | null> {
    const conn = await pool.getConnection()
    try {
      const [[rows]] = await conn.execute<RowDataPacket[]>(
        'SELECT category_id, category_user_id, category_name, category_type, category_color, category_created_at FROM categories WHERE category_user_id = ? AND category_name = ?',
        [userId, categoryName]
      )
      return (rows as Category) || null
    } finally {
      conn.release()
    }
  }

  async findAllByUser(userId: number, type?: 'income' | 'expense'): Promise<Category[]> {
    const conn = await pool.getConnection()
    try {
      if (type) {
        const [rows] = await conn.execute<RowDataPacket[]>(
          'SELECT category_id, category_user_id, category_name, category_type, category_color, category_created_at FROM categories WHERE category_user_id = ? AND category_type = ? ORDER BY category_name',
          [userId, type]
        )
        return rows as Category[]
      }

      const [rows] = await conn.execute<RowDataPacket[]>(
        'SELECT category_id, category_user_id, category_name, category_type, category_color, category_created_at FROM categories WHERE category_user_id = ? ORDER BY category_name',
        [userId]
      )
      return rows as Category[]
    } finally {
      conn.release()
    }
  }

  async createCategory(userId: number, data: CreateCategoryInput): Promise<Category> {
    const conn = await pool.getConnection()
    try {
      const [result] = await conn.execute<ResultSetHeader>(
        'INSERT INTO categories (category_user_id, category_name, category_type, category_color) VALUES (?, ?, ?, ?)',
        [userId, data.name, data.type, data.color]
      )

      const category = await this.findById(userId, result.insertId)
      if (!category) {
        throw new AppError('Failed to create category', 500)
      }

      return category
    } finally {
      conn.release()
    }
  }

  async updateCategory(
    userId: number,
    categoryId: number,
    data: UpdateCategoryInput
  ): Promise<Category> {
    const conn = await pool.getConnection()
    try {
      const updates: string[] = []
      const values: (string | number)[] = []

      if (data.name !== undefined) {
        updates.push('category_name = ?')
        values.push(data.name)
      }

      if (data.color !== undefined) {
        updates.push('category_color = ?')
        values.push(data.color)
      }

      if (updates.length === 0) {
        const category = await this.findById(userId, categoryId)
        if (!category) {
          throw new AppError('Category not found', 404)
        }
        return category
      }

      await conn.beginTransaction()

      values.push(categoryId, userId)

      await conn.execute(
        `UPDATE categories SET ${updates.join(', ')} WHERE category_id = ? AND category_user_id = ?`,
        values
      )

      const updatedCategory = await this.findById(userId, categoryId)
      if (!updatedCategory) {
        throw new AppError('Category not found', 404)
      }

      await conn.commit()
      return updatedCategory
    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      conn.release()
    }
  }

  async deleteCategory(userId: number, categoryId: number): Promise<void> {
    const conn = await pool.getConnection()
    try {
      await conn.execute('DELETE FROM categories WHERE category_id = ? AND category_user_id = ?', [
        categoryId,
        userId,
      ])
    } finally {
      conn.release()
    }
  }

  async hasTransactions(categoryId: number): Promise<boolean> {
    const conn = await pool.getConnection()
    try {
      const [[rows]] = await conn.execute<RowDataPacket[]>(
        'SELECT COUNT(*) AS transactionCount FROM transactions WHERE transaction_category_id = ?',
        [categoryId]
      )
      const count = (rows?.transactionCount as number) || 0
      return count > 0
    } finally {
      conn.release()
    }
  }
}

export const categoryModel = new CategoryModel()
