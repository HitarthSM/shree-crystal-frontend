import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Bell,
  User,
  HelpCircle,
  LogOut,
  Building2,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

export function MemberLayout() {
  const { user, clearUser } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/statements', icon: FileText, label: 'My Statements' },
    { to: '/dashboard/notices', icon: Bell, label: 'Notices' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/support', icon: HelpCircle, label: 'Support' },
  ]

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Top Header - Deep Saffron */}
      <header className="h-20 bg-deep-saffron flex-shrink-0 flex items-center px-6 lg:px-8 z-40 sticky top-0 border-b border-deep-saffron-light">
        <div className="max-w-content mx-auto w-full flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 text-ivory group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-deep-saffron rounded-sm">
            <Building2 className="h-8 w-8 text-warm-gold" />
            <span className="font-display font-bold text-xl tracking-wide hidden sm:inline-block">Shree Crystal Co-op</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="font-body font-medium text-ivory text-sm">{user?.name || 'Member'}</p>
              <p className="font-data text-xs text-ivory/60">{user?.memberId || 'SC-00000'}</p>
            </div>
            
            <button className="relative text-ivory/80 hover:text-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-full p-1">
              <Bell className="h-5 w-5" />
              {/* Notification badge dot */}
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-deep-crimson" />
            </button>

            <div className="h-10 w-10 rounded-full border-2 border-warm-gold/50 flex items-center justify-center bg-deep-saffron-light text-ivory font-display font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'M'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with responsive Sidebar/Top-nav */}
      <div className="flex-1 flex max-w-content mx-auto w-full">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex w-[240px] flex-col py-8 pr-8 border-r border-ledger-rule mr-8 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-[4px] text-sm font-medium transition-colors font-body',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold',
                    isActive
                      ? 'bg-deep-saffron/5 text-deep-saffron border-l-3 border-warm-gold pl-3'
                      : 'text-dark-mahogany hover:bg-black/5',
                  )
                }
              >
                <item.icon className={cn('h-5 w-5', 'opacity-80')} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-auto text-sm font-medium text-dark-mahogany hover:bg-black/5 rounded-[4px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold font-body"
          >
            <LogOut className="h-5 w-5 opacity-70" />
            Logout
          </button>
        </aside>

        {/* Mobile Nav (Bottom bar - simplified) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-ivory border-t border-ledger-rule flex justify-around items-center h-16 z-50 px-2 pb-safe">
           {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center w-full h-full gap-1',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold inset-ring',
                    isActive ? 'text-deep-saffron' : 'text-mahogany-muted hover:text-dark-mahogany',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('h-5 w-5', isActive && 'fill-deep-saffron/10')} />
                    <span className="text-[10px] font-medium font-body">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
        </nav>

        {/* Page Content */}
        <main className="flex-1 py-6 md:py-8 px-4 md:px-0 pb-24 md:pb-8 w-full min-w-0 bg-ledger-paper">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
