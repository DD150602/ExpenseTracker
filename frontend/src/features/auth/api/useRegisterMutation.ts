import { useMutation, useQueryClient } from '@tanstack/react-query'
import { register } from './register'

export function useRegisterMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })
}
