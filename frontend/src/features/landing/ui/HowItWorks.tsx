const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up in seconds with just your email. No credit card required to get started.',
  },
  {
    step: '02',
    title: 'Add Your Transactions',
    description:
      'Quickly log your income and expenses, or connect your accounts for automatic tracking.',
  },
  {
    step: '03',
    title: 'Set Your Budgets',
    description:
      'Define spending limits for different categories and let us help you stay on track.',
  },
  {
    step: '04',
    title: 'Watch Your Wealth Grow',
    description: 'Get insights, hit your goals, and build better financial habits over time.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Getting Started is Simple
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start tracking your finances in minutes, not hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              <div className="text-6xl font-bold text-border mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
