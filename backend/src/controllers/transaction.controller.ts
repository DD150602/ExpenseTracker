import type { Request, Response } from 'express'
import { type TransactionService, transactionService } from '../services/transaction.service'
import { AppError } from '../utils/AppError'
import { asyncHandler } from '../utils/asyncHandler'
import { getTransactionsQuerySchema } from '../schemas/transaction.schema'

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  getTransactionById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const transactionId = this.parseTransactionId(req.params.id)

    const transaction = await this.transactionService.getTransactionById(userId, transactionId)
    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction,
    })
  })

  getAllUserTransactions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const query = getTransactionsQuerySchema.parse(req.query)

    const transactions = await this.transactionService.getAllUserTransactions(userId, query)

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: transactions,
    })
  })

  createTransaction = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const transaction = await this.transactionService.createTransaction(userId, req.body)
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    })
  })

  updateTransaction = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const transactionId = this.parseTransactionId(req.params.id)
    const updatedTransaction = await this.transactionService.updateTransaction(
      userId,
      transactionId,
      req.body
    )

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    })
  })

  deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId
    const transactionId = this.parseTransactionId(req.params.id)
    await this.transactionService.deleteTransaction(userId, transactionId)

    res.sendStatus(204)
  })

  private parseTransactionId(id: string | undefined): number {
    if (!id) {
      throw new AppError('Transaction ID is required', 400)
    }

    const transactionId = Number.parseInt(id, 10)
    if (Number.isNaN(transactionId) || transactionId <= 0) {
      throw new AppError('Invalid transaction ID', 400)
    }

    return transactionId
  }
}

export const transactionController = new TransactionController(transactionService)
