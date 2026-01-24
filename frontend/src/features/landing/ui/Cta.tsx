import { ArrowRight } from 'lucide-react'
import { Button } from '@/shared/ui/shadcn/button'

export function CTA() {
  return (
    <section className="py-20 md:py-28 bg-primary">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground text-balance max-w-2xl mx-auto">
          Start Building Better Financial Habits Today
        </h2>
        <p className="mt-4 text-lg text-primary-foreground/80 max-w-lg mx-auto">
          Join thousands of users who have transformed their relationship with money.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="gap-2">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
          >
            Talk to Sales
          </Button>
        </div>
      </div>
    </section>
  )
}
