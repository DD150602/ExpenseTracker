import { CardFormWrapper } from '@/features/auth/ui/CardFormWrapper'
import { LoginForm } from '../ui/LoginForm'

export function LoginPage() {
  return (
    <CardFormWrapper title="Login" message="Sing in to continue.">
      <LoginForm />
    </CardFormWrapper>
  )
}
