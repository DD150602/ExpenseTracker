import { Menu, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Cashflow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              Log in
            </Link>
            <Link className='bg-black text-white rounded-sm p-2' to="/register">Sing In</Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                How it Works
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link to="/login" className="justify-start">
                  Log in
                </Link>
                <Link className='bg-black text-white rounded-sm p-2' to="register">Sing In</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
