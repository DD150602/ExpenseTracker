import { useQuery } from '@tanstack/react-query'
import { httpClient } from '@/shared/lib/api/httpClient'

export type SessionUser = {
  id: number
  email: string
  name?: string
}

export type SessionResponse = {
  user: SessionUser
}

async function fetchSession(): Promise<SessionResponse> {
  const res = await httpClient.get('/users/info')
  return res.data
}

export function useSessionQuery() {
  return useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    retry: false, // don’t spam retries on 401
  })
}
