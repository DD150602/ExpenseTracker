import { Router } from 'express'
import { userController } from '../controllers/user.controller'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/info', auth, userController.getUserInfo)

export default router
