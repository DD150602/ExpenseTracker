export type CardFormWrapperProps = {
  title: string
  message?: string
  children: ReactNode
}

export type LoginResponse = {
  success: true
  message: string
  data: {
    user: {
      user_id: number
      user_username: string
      user_email: string
      user_created_at: string
      user_updated_at: string
    }
    token: string
  }
}
