import { CTA } from '@/features/landing/ui/Cta'
import { Features } from '@/features/landing/ui/Features'
import { Footer } from '@/features/landing/ui/Footer'
import { Header } from '@/features/landing/ui/Header'
import { Hero } from '@/features/landing/ui/Hero'
import { HowItWorks } from '@/features/landing/ui/HowItWorks'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
