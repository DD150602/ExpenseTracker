import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { registerSchema } from '../schemas/registerSchema'
import { useRegisterMutation } from '../api/useRegisterMutation'
import type { ApiErrorResponse, RegisterInput } from '../types/types'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { Label } from '@/shared/ui/shadcn/label'
import { Input } from '@/shared/ui/shadcn/input'
import { Button } from '@/shared/ui/shadcn/button'

export function RegisterForm() {
  const registerMutation = useRegisterMutation()
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  })
  const isSubmitting = form.formState.isSubmitting || registerMutation.isPending

  const onSubmit = async (values: RegisterInput) => {
    try {
      const res = await registerMutation.mutateAsync(values)
      toast.success(res.message)
      navigate('/login', { replace: true })
    } catch (error) {
      let message = 'Failed to register. Please try again.'
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        message = error.response?.data?.message ?? message
      } else if (error instanceof Error) {
        message = error.message
      }
      toast.error(message)
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" type="text" autoComplete="username" {...form.register('username')} />
        {form.formState.errors.username ? (
          <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
        ) : null}
      </div>
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
          autoComplete="new-password"
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
