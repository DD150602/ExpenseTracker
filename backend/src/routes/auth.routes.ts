import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { validate } from '../middlewares/validator'
import { loginSchema, registerSchema } from '../schemas/user.schema';

const router = Router()

router.post('/login', validate(loginSchema), authController.login)
router.post('/register', validate(registerSchema), authController.register)

export default router
