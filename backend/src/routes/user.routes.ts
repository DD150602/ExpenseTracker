import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { auth } from '../middlewares/auth'
import { validate } from '../middlewares/validator'
import { updateProfileSchema } from '../schemas/user.schema'

const router = Router()

router.use(auth)

router.get('/info', userController.getUserInfo)
router.patch('/profile', validate(updateProfileSchema), userController.updateUserInfo)

export default router
