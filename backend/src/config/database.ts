import mysql from 'mysql2/promise'
import { env } from './env'

const pool = mysql.createPool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
})

export default pool
