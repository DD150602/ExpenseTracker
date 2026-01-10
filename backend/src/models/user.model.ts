import type { RowDataPacket } from 'mysql2'
import pool from '../config/database'
import type { User } from '../types'

export class UserModel {
  async findByEmail(email: string): Promise<User | null> {
    const conn = await pool.getConnection()
    const [[rows]] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE user_email = ?',
      [email]
    )
    conn.release()
    return rows as User | null
  }
}

export const userModel = new UserModel()
