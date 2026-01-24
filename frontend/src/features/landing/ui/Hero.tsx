import { ArrowRight, TrendingDown, TrendingUp } from 'lucide-react'
import { Button } from '@/shared/ui/shadcn/button'
import { Link } from 'react-router'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-sm font-medium text-accent mb-6">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Track your money smarter
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground text-balance leading-tight">
              Take Control of Your Finances
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
              Track every income and expense effortlessly. Get clear insights into your spending
              habits and achieve your financial goals faster.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link className="bg-black text-white rounded-sm p-2" to="/register">
                Start Tracking Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <title>no credit card</title>
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto">
            <div className="relative bg-card rounded-2xl shadow-xl border border-border p-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className="text-3xl font-semibold text-foreground">$12,847.50</p>
                </div>
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                  +2.5% this month
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Income</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">+$5,240.00</p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Expenses</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-destructive">-$3,120.50</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Budget Progress</span>
                  <span className="text-sm font-medium text-foreground">68%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 rounded-full bg-accent" style={{ width: '68%' }} />
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg border border-border p-4 hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-black/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Savings Goal</p>
                  <p className="text-sm font-semibold text-foreground">$2,500 / $5,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
