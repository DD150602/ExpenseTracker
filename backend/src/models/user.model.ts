import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import pool from '../config/database'
import type { RegisterInput, User, UserName } from '../types'

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
  async findByUsername(userName: string): Promise<UserName | null> {
    const conn = await pool.getConnection()
    const [[rows]] = await conn.execute<RowDataPacket[]>(
      'SELECT user_id, user_username FROM users WHERE user_username = ?',
      [userName]
    )
    conn.release()
    return rows as UserName | null
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

  async updateUser(
    userId: number,
    data: Partial<{ username: string; email: string }>
  ): Promise<User | null> {
    const conn = await pool.getConnection()

    try {
      const updates: string[] = []
      const values: (string | number)[] = []

      if (data.username !== undefined) {
        updates.push('user_username = ?')
        values.push(data.username)
      }

      if (data.email !== undefined) {
        updates.push('user_email = ?')
        values.push(data.email)
      }

      if (updates.length === 0) {
        const user = await this.findById(userId)
        conn.release()
        return user
      }

      values.push(userId)

      await conn.execute<ResultSetHeader>(
        `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
        values
      )
      const updatedUser = await this.findById(userId)
      conn.release()
      return updatedUser
    } catch (error) {
      conn.release()
      throw error
    }finally{
      conn.release()
    }
  }
}

export const userModel = new UserModel()
