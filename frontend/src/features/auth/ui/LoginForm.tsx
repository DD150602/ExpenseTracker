import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { loginSchema, type LoginInput } from '../schemas/loginSchema'
import { useLoginMutation } from '../api/useLoginMutation'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import axios from 'axios'
import type { ApiErrorResponse } from '../types/types'

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginInput) => {
    try {
      const res = await loginMutation.mutateAsync(values)
      toast.success(res.message)
      navigate('/', { replace: true })
    } catch (err) {
      let message = 'Login failed. Please try again.'
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        message = err.response?.data?.message ?? message
      } else if (err instanceof Error) {
        message = err.message
      }
      toast.error(message)
    }
  }

  const isSubmitting = form.formState.isSubmitting || loginMutation.isPending

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register('email')} />
        {form.formState.errors.email ? (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...form.register('password')}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
