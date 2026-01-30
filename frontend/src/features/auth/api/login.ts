import type { LoginInput } from '@/features/auth/schemas/loginSchema'
import { httpClient } from '@/shared/lib/api/httpClient'
import type { LoginResponse } from '../types/types'

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await httpClient.post('/auth/login', input)
  return res.data
}
