import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  Activity,
  Settings,
  Download,
  Database,
  LogOut,
  Search,
  MessageSquare,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Badge } from '@/components/ui/Badge'

export function AdminLayout() {
  const { user, clearUser } = useAuthStore()
  const navigate = useNavigate()
  // const location = useLocation()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [hasNewNotifs, setHasNewNotifs] = useState(true)

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/admin/members?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleNotifs = () => {
    setIsNotifOpen(!isNotifOpen)
    if (hasNewNotifs) setHasNewNotifs(false)
  }

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/members', icon: Users, label: 'Members' },
    { to: '/admin/statements', icon: FileText, label: 'Statements' },
    { to: '/admin/notices', icon: Bell, label: 'Notices & Circulars' },
    { to: '/admin/website-cms', icon: LayoutDashboard, label: 'Website CMS' },
    { to: '/admin/queries', icon: MessageSquare, label: 'Support Queries' },
    { to: '/admin/activity', icon: Activity, label: 'Activity Log' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  const reportItems = [
    { to: '/admin/export', icon: Download, label: 'Export Data' },
    { to: '/admin/backup', icon: Database, label: 'Backup Status' },
  ]

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar - Deep Saffron */}
      <aside className="w-[260px] bg-deep-saffron flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-40">
        <div className="h-20 flex items-center px-6 border-b border-deep-saffron-light">
          <h2 className="font-display font-bold text-xl text-ivory">Shree Crystal Co-op</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-6 mb-3">
            <span className="font-data text-xs text-ivory/50 tracking-wider uppercase">Main</span>
          </div>
          <nav className="flex flex-col mb-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`
                }
              >
                <item.icon className="h-5 w-5 opacity-80" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="px-6 mb-3">
            <span className="font-data text-xs text-ivory/50 tracking-wider uppercase">Reports</span>
          </div>
          <nav className="flex flex-col">
            {reportItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`
                }
              >
                <item.icon className="h-5 w-5 opacity-80" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-deep-saffron-light">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="font-body font-medium text-ivory text-sm truncate max-w-[140px]">
                {user?.name || 'Admin User'}
              </p>
              <Badge variant="general" className="bg-ivory/10 text-ivory/80 mt-1 uppercase text-[10px]">
                {user?.role || 'Operator'}
              </Badge>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-ivory/70 hover:text-ivory hover:bg-white/5 rounded-[4px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-ivory border-b border-ledger-rule flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="font-data text-sm text-mahogany-muted">
            {/* Breadcrumb would go here dynamically based on route */}
            Dashboard
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mahogany-muted" />
              <input
                type="text"
                placeholder="Search member ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="h-10 pl-9 pr-4 rounded-[4px] border border-ledger-rule bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-warm-gold w-64"
              />
            </div>

            <div className="relative">
              <button 
                onClick={toggleNotifs}
                className="relative text-dark-mahogany hover:text-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-full p-1"
              >
                <Bell className="h-5 w-5" />
                {hasNewNotifs && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-deep-crimson" />
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-[6px] shadow-paper border border-ledger-rule z-50 overflow-hidden animate-fade-slide-up">
                    <div className="p-4 border-b border-ledger-rule bg-ivory/50">
                      <h3 className="font-display font-medium text-dark-mahogany">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-ledger-rule hover:bg-warm-gold/5 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-dark-mahogany mb-1">Database Backup Completed</p>
                        <p className="text-xs text-mahogany-muted">The scheduled daily backup was successful.</p>
                        <p className="text-[10px] text-mahogany-muted/70 mt-2">2 hours ago</p>
                      </div>
                      <div className="p-4 border-b border-ledger-rule hover:bg-warm-gold/5 transition-colors cursor-pointer">
                        <p className="text-sm font-medium text-dark-mahogany mb-1">New Member Registration</p>
                        <p className="text-xs text-mahogany-muted">SC-00849 has submitted KYC documents for approval.</p>
                        <p className="text-[10px] text-mahogany-muted/70 mt-2">5 hours ago</p>
                      </div>
                    </div>
                    <div className="p-3 bg-ivory/50 text-center border-t border-ledger-rule">
                      <button className="text-xs font-medium text-warm-gold hover:text-warm-gold-hover transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="h-9 w-9 rounded-full bg-deep-saffron flex items-center justify-center text-ivory font-display font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-ledger-paper overflow-x-hidden">
          <div className="max-w-content mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
