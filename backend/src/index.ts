import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json } from 'express'
import { env } from './config/env'

const app = express()

app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(json())
app.use(cookieParser())

app.listen(env.PORT, () => console.log(`server runing on port ${env.PORT}`))
