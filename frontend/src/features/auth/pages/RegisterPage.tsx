import { CardFormWrapper } from '@/features/auth/ui/CardFormWrapper'
import { RegisterForm } from '../ui/RegisterForm'

export function RegisterPage() {
  return (
    <CardFormWrapper title="Create Account" message="Register to start tracking expenses.">
      <RegisterForm />
    </CardFormWrapper>
  )
}
