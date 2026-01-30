import { Link, Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Simple header (optional) */}
      <header className="w-full border-b">
        <div className="mx-auto max-w-md px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-semibold">
            Expense Tracker
          </Link>
          <nav className="text-sm flex gap-3">
            <Link to="/login" className="bg-black text-white rounded-sm p-2">
              Login
            </Link>
            <Link to="/register" className="bg-black text-white rounded-sm p-2">
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Centered auth card area */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Simple footer (optional) */}
      <footer className="w-full border-t">
        <div className="mx-auto max-w-md px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Expense Tracker
        </div>
      </footer>
    </div>
  )
}
