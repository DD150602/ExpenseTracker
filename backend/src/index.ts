import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json } from 'express'
import { env } from './config/env'
import { errorHandler } from './middlewares/errorHandler'
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express()

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

app.use(errorHandler)

app.listen(env.PORT, () => console.log(`server runing on port ${env.PORT}`))
