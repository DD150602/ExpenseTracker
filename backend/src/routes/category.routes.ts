import { Router } from 'express'
import { categoryController } from '../controllers/category.controller'
import { auth } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema'

const router = Router()
router.use(auth)

router.post('/', validate(createCategorySchema), categoryController.create)
router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getById)
router.patch('/:id', validate(updateCategorySchema), categoryController.update)
router.delete('/:id', categoryController.delete)

export default router
