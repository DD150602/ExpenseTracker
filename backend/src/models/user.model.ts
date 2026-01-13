import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import pool from '../config/database'
import type { RegisterInput, User } from '../types'

export class UserModel {
  async findByEmail(email: string): Promise<User | null> {
    const conn = await pool.getConnection()
    const [[rows]] = await conn.execute<RowDataPacket[]>(
      'SELECT user_id, user_username, user_email, user_password, user_created_at, user_updated_at FROM users WHERE user_email = ?',
      [email]
    )
    conn.release()
    return rows as User | null
  }

  async findById(user_id: number): Promise<User | null> {
    const conn = await pool.getConnection()
    const [[rows]] = await conn.execute<RowDataPacket[]>(
      'SELECT user_id, user_username, user_email, user_created_at, user_updated_at FROM users WHERE user_id = ?',
      [user_id]
    )
    conn.release()
    return rows as User | null
  }

  async createUser(data: RegisterInput): Promise<number | null> {
    const conn = await pool.getConnection()
    const [result] = await conn.execute<ResultSetHeader>(
      'INSERT INTO users (user_username, user_email, user_password) VALUES (?, ?, ?)',
      [data.username, data.email, data.password]
    )
    conn.release()
    return result.insertId || null
  }
}

export const userModel = new UserModel()
