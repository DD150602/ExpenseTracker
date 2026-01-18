import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import pool from '../config/database'
import type { CreateTransactionInput, TransactionListItem, UpdateTransactionInput } from '../types'
import { AppError } from '../utils/AppError'

export class TransactionModel {
  async findAllByUser(
    userId: number,
    filters: {
      type?: 'income' | 'expense'
      categoryId?: number
      startDate?: string
      endDate?: string
      limit: number
      offset: number
    }
  ): Promise<TransactionListItem[]> {
    const conn = await pool.getConnection()
    try {
      const where: string[] = ['transactions.transaction_user_id = ?']
      const params: (string | number)[] = []
      params.push(userId)

      if (filters.type) {
        where.push('transactions.transaction_type = ?')
        params.push(filters.type)
      }
      if (filters.categoryId !== undefined) {
        where.push('transactions.transaction_category_id = ?')
        params.push(filters.categoryId)
      }
      if (filters.startDate) {
        where.push('transactions.transaction_date >= ?')
        params.push(filters.startDate)
      }
      if (filters.endDate) {
        where.push('transactions.transaction_date <= ?')
        params.push(filters.endDate)
      }

      params.push(String(filters.limit), String(filters.offset))

      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT
        transaction_id,
        category_name,
        transaction_amount,
        transaction_date,
        transaction_type,
        transaction_description
       FROM transactions
       INNER JOIN categories ON transactions.transaction_category_id = categories.category_id
       WHERE ${where.join(' AND ')}
       ORDER BY transaction_date DESC, transaction_id DESC
       LIMIT ? OFFSET ?;`,
        params
      )

      return rows as TransactionListItem[]
    } finally {
      conn.release()
    }
  }

  async findById(userId: number, transactionId: number): Promise<TransactionListItem | null> {
    const conn = await pool.getConnection()
    try {
      const [[row]] = await conn.execute<RowDataPacket[]>(
        `SELECT transaction_id, category_name, transaction_amount, transaction_date, transaction_type, transaction_description
       FROM transactions
       JOIN categories ON transactions.transaction_category_id = categories.category_id
       WHERE transaction_user_id = ? AND transaction_id = ?
       LIMIT 1`,
        [userId, transactionId]
      )
      return (row as TransactionListItem) ?? null
    } finally {
      conn.release()
    }
  }

  async createTransaction(
    userId: number,
    data: CreateTransactionInput
  ): Promise<TransactionListItem> {
    const conn = await pool.getConnection()
    try {
      const [[cat]] = await conn.execute<RowDataPacket[]>(
        `SELECT category_id, category_user_id
       FROM categories
       WHERE category_id = ?`,
        [data.categoryId]
      )

      if (!cat) {
        throw new AppError('Category not found', 404)
      }
      if (cat.category_user_id !== userId) {
        throw new AppError("Category doesn't belong to user", 403)
      }

      const [result] = await conn.execute<ResultSetHeader>(
        `INSERT INTO transactions (
        transaction_user_id,
        transaction_category_id,
        transaction_amount,
        transaction_date,
        transaction_type,
        transaction_description
      ) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, data.categoryId, data.amount, data.date, data.type, data.description ?? null]
      )

      const newTransaction = await this.findById(userId, result.insertId)
      if (!newTransaction) {
        throw new AppError('Failed to create transaction', 500)
      }

      return newTransaction
    } finally {
      conn.release()
    }
  }

  async updateTransaction(
    userId: number,
    transactionId: number,
    data: UpdateTransactionInput
  ): Promise<TransactionListItem | null> {
    const conn = await pool.getConnection()
    try {
      const updates: string[] = []
      const params: (string | number | null)[] = []
      if (data.categoryId !== undefined) {
        const [[cat]] = await conn.execute<RowDataPacket[]>(
          `SELECT category_id, category_user_id
            FROM categories
            WHERE category_id = ?`,
          [data.categoryId]
        )

        if (!cat) {
          throw new AppError('Category not found', 404)
        }
        if (cat.category_user_id !== userId) {
          throw new AppError("Category doesn't belong to user", 403)
        }
      }
      if (data.categoryId !== undefined) {
        updates.push('transaction_category_id = ?')
        params.push(data.categoryId)
      }
      if (data.amount !== undefined) {
        updates.push('transaction_amount = ?')
        params.push(data.amount)
      }
      if (data.date !== undefined) {
        updates.push('transaction_date = ?')
        params.push(data.date)
      }
      if (data.description !== undefined) {
        updates.push('transaction_description = ?')
        params.push(data.description ?? null)
      }
      if (data.type !== undefined) {
        updates.push('transaction_type = ?')
        params.push(data.type)
      }
      if (updates.length === 0) {
        throw new AppError('No fields to update', 400)
      }

      params.push(userId, transactionId)
      const [result] = await conn.execute<ResultSetHeader>(
        `UPDATE transactions
          SET ${updates.join(', ')}
          WHERE transaction_user_id = ? AND transaction_id = ?`,
        params
      )

      if (result.affectedRows === 0) {
        return null
      }

      const updatedTransaction = await this.findById(userId, transactionId)
      return updatedTransaction
    } finally {
      conn.release()
    }
  }

  async deleteTransaction(userId: number, transactionId: number): Promise<boolean> {
    const conn = await pool.getConnection()
    try {
      const [result] = await conn.execute<ResultSetHeader>(
        `DELETE FROM transactions WHERE transaction_user_id = ? AND transaction_id = ?`,
        [userId, transactionId]
      )
      return result.affectedRows > 0
    } finally {
      conn.release()
    }
  }
}

export const transactionModel = new TransactionModel()
