import { type TransactionModel, transactionModel } from '../models/transaction.model'
import type { CreateTransactionInput, UpdateTransactionInput } from '../types'
import { AppError } from '../utils/AppError'

export class TransactionService {
  constructor(private transactionModel: TransactionModel) {}

  async getTransactionById(userId: number, transactionId: number) {
    const transaction = await this.transactionModel.findById(userId, transactionId)
    if (!transaction) {
      throw new AppError('Transaction not found', 404)
    }
    return transaction
  }

  async getAllUserTransactions(
    userId: number,
    filters: {
      type?: 'income' | 'expense'
      categoryId?: number
      startDate?: string
      endDate?: string
      limit: number
      offset: number
    }
  ) {
    return await this.transactionModel.findAllByUser(userId, filters)
  }

  async createTransaction(userId: number, data: CreateTransactionInput) {
    const transaction = await this.transactionModel.createTransaction(userId, data)
    return transaction
  }

  async updateTransaction(userId: number, transactionId: number, data: UpdateTransactionInput) {
    const updated = await this.transactionModel.updateTransaction(userId, transactionId, data)
    if (!updated) {
      throw new AppError('Transaction not found', 404)
    }
    return updated
  }

  async deleteTransaction(userId: number, transactionId: number) {
    const deleted = await this.transactionModel.deleteTransaction(userId, transactionId)
    if (!deleted) {
      throw new AppError('Transaction not found', 404)
    }
  }
}

export const transactionService = new TransactionService(transactionModel)
