import { Bell, PieChart, Shield, Smartphone, Wallet, Zap } from 'lucide-react'

const features = [
  {
    icon: PieChart,
    title: 'Visual Insights',
    description:
      'Beautiful charts and graphs that make understanding your spending habits easy and intuitive.',
  },
  {
    icon: Wallet,
    title: 'Multi-Account Support',
    description: 'Track all your bank accounts, credit cards, and cash in one unified dashboard.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description:
      "Get notified when you're approaching budget limits or when unusual spending is detected.",
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description:
      'Your financial data is encrypted with the same security standards used by major banks.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description:
      'Access your finances anywhere with our responsive design that works on any device.',
  },
  {
    icon: Zap,
    title: 'Quick Entry',
    description:
      'Add transactions in seconds with smart categorization and recurring expense tracking.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-balance">
            Everything You Need to Manage Money
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to give you complete control over your financial life.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-5">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
