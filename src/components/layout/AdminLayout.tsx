import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
  Menu,
  X,
  Building2,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { signOut } from '@/api/auth'
import { useLanguageStore } from '@/store/language.store'
import { translations } from '@/lib/i18n/translations'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const { user } = useAuthStore()
  const { language } = useLanguageStore()
  const t = translations[language]
  const navigate = useNavigate()
  const location = useLocation()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [hasNewNotifs, setHasNewNotifs] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
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
    { to: '/admin', icon: LayoutDashboard, label: t.adminNav.dashboard, end: true },
    { to: '/admin/members', icon: Users, label: t.adminNav.members },
    { to: '/admin/statements', icon: FileText, label: t.adminNav.statements },
    { to: '/admin/notices', icon: Bell, label: t.adminNav.notices },
    { to: '/admin/website-cms', icon: LayoutDashboard, label: t.adminNav.websiteCms },
    { to: '/admin/queries', icon: MessageSquare, label: t.adminNav.queries },
    { to: '/admin/activity', icon: Activity, label: t.adminNav.activity },
    { to: '/admin/settings', icon: Settings, label: t.adminNav.settings },
  ]

  const reportItems = [
    { to: '/admin/export', icon: Download, label: t.adminNav.exportData },
    { to: '/admin/backup', icon: Database, label: t.adminNav.backupStatus },
  ]

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Deep Saffron */}
      <aside 
        className={cn(
          "w-[260px] bg-deep-saffron flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-in-out md:translate-x-0 shadow-xl md:shadow-none",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-deep-saffron-light">
          <div className="flex items-center gap-2 text-ivory">
            <Building2 className="h-6 w-6 text-warm-gold shrink-0" />
            <h2 className="font-display font-bold text-lg text-ivory truncate">{t.nav.societyName}</h2>
          </div>
          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Close menu"
            className="md:hidden p-1 text-ivory/80 hover:text-ivory rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-6 mb-3">
            <span className="font-data text-xs text-ivory/50 tracking-wider uppercase">{t.adminNav.mainSection}</span>
          </div>
          <nav className="flex flex-col mb-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsMobileSidebarOpen(false)}
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
            <span className="font-data text-xs text-ivory/50 tracking-wider uppercase">{t.adminNav.reportsSection}</span>
          </div>
          <nav className="flex flex-col">
            {reportItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileSidebarOpen(false)}
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
              <p className="font-body font-medium text-ivory text-sm truncate max-w-[180px]">
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
            <span>{t.adminNav.signOut}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-[260px] flex flex-col min-h-screen w-full min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-ivory border-b border-ledger-rule flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger trigger on mobile */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="md:hidden p-2 rounded text-dark-mahogany hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="font-data text-sm text-mahogany-muted">
              {location.pathname.startsWith('/admin/members') ? t.adminNav.members :
               location.pathname.startsWith('/admin/statements') ? t.adminNav.statements :
               location.pathname.startsWith('/admin/notices') ? t.adminNav.notices :
               location.pathname.startsWith('/admin/website-cms') ? t.adminNav.websiteCms :
               location.pathname.startsWith('/admin/queries') ? t.adminNav.queries :
               location.pathname.startsWith('/admin/activity') ? t.adminNav.activity :
               location.pathname.startsWith('/admin/settings') ? t.adminNav.settings :
               location.pathname.startsWith('/admin/export') ? t.adminNav.exportData :
               location.pathname.startsWith('/admin/backup') ? t.adminNav.backupStatus :
               t.adminNav.dashboard}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <LanguageSwitcher variant="light" />

            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mahogany-muted" />
              <input
                type="text"
                placeholder={t.adminNav.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="h-10 pl-9 pr-4 rounded-[4px] border border-ledger-rule bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-warm-gold w-64"
              />
            </div>

            <div className="relative">
              <button 
                onClick={toggleNotifs}
                aria-label={t.adminNav.notifications}
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
                      <h3 className="font-display font-medium text-dark-mahogany">{t.adminNav.notifications}</h3>
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
                        {t.adminNav.markAllRead}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-ledger-paper overflow-x-hidden">
          <div className="max-w-content mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
