import { Router } from 'express'
import { transactionController } from '../controllers/transaction.controller'
import { auth } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import { createTransactionSchema, updateTransactionSchema } from '../schemas/transaction.schema'

const router = Router()
router.use(auth)

router.get('/', transactionController.getAllUserTransactions)
router.post('/', validate(createTransactionSchema), transactionController.createTransaction)
router.get('/:id', transactionController.getTransactionById)
router.patch('/:id', validate(updateTransactionSchema), transactionController.updateTransaction)
router.delete('/:id', transactionController.deleteTransaction)

export default router
