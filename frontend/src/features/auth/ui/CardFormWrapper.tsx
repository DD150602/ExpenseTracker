import type { CardFormWrapperProps } from '@/features/auth/types/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'

export function CardFormWrapper({ children, message, title }: CardFormWrapperProps) {
  return (
    <Card className="p-6 shadow-sm bg-background">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">{message}</CardDescription>
      </CardHeader>
      <CardContent className="mt-6">{children}</CardContent>
    </Card>
  )
}
