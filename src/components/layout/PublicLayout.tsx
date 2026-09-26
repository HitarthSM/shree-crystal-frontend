import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Building2, Menu, X } from 'lucide-react'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useLanguageStore } from '@/store/language.store'

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { t } = useLanguageStore()

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Fixed Nav */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-deep-saffron z-50 px-6 lg:px-8 border-b border-deep-saffron-light">
        <div className="max-w-content mx-auto h-full flex items-center justify-between">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 text-ivory group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-saffron rounded-sm"
          >
            <Building2 className="h-8 w-8 text-warm-gold group-hover:text-warm-gold-light transition-colors" />
            <span className="font-display font-bold text-xl tracking-wide">{t.nav.societyName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/about" className="nav-link">{t.nav.aboutUs}</Link>
            <Link to="/notices" className="nav-link">{t.nav.publicNotices}</Link>
            <Link to="/contact" className="nav-link">{t.nav.contact}</Link>
            <div className="w-px h-6 bg-ivory/20 mx-1" />
            
            {/* Language Switcher */}
            <LanguageSwitcher />

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 font-body font-semibold rounded-[4px] transition-all duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 bg-warm-gold text-dark-mahogany hover:bg-warm-gold-hover h-11 px-5 text-base shadow-sm"
            >
              {t.nav.memberLogin}
            </Link>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden flex items-center justify-center min-h-[44px] min-w-[44px] p-2 text-ivory hover:text-warm-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-md"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Dropdown / Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-deep-saffron border-b border-deep-saffron-light shadow-xl px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Mobile Language Switcher */}
            <LanguageSwitcher variant="mobile" />

            <Link
              to="/about"
              onClick={closeMenu}
              className={`py-2 text-base font-medium transition-colors ${location.pathname === '/about' ? 'text-warm-gold' : 'text-ivory hover:text-warm-gold'}`}
            >
              {t.nav.aboutUs}
            </Link>
            <Link
              to="/notices"
              onClick={closeMenu}
              className={`py-2 text-base font-medium transition-colors ${location.pathname === '/notices' ? 'text-warm-gold' : 'text-ivory hover:text-warm-gold'}`}
            >
              {t.nav.publicNotices}
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className={`py-2 text-base font-medium transition-colors ${location.pathname === '/contact' ? 'text-warm-gold' : 'text-ivory hover:text-warm-gold'}`}
            >
              {t.nav.contact}
            </Link>
            <div className="pt-2 border-t border-ivory/15">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center min-h-[44px] w-full font-body font-semibold rounded-[4px] bg-warm-gold text-dark-mahogany hover:bg-warm-gold-hover text-base shadow-sm"
              >
                {t.nav.memberLogin}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content (padded for fixed header) */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-deep-saffron border-t border-warm-gold pt-12 pb-8 px-6 lg:px-8 text-ivory/80">
        <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">{t.footer.societyName}</h4>
            <p className="font-body text-sm mb-2">{t.footer.regInfo}</p>
            <p className="font-body text-sm">{t.footer.description}</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-1 text-sm font-body">
              <li><Link to="/about" className="inline-block py-1.5 hover:text-warm-gold transition-colors">{t.footer.aboutUs}</Link></li>
              <li><Link to="/notices" className="inline-block py-1.5 hover:text-warm-gold transition-colors">{t.footer.notices}</Link></li>
              <li><Link to="/contact" className="inline-block py-1.5 hover:text-warm-gold transition-colors">{t.footer.contact}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">{t.footer.legal}</h4>
            <ul className="space-y-1 text-sm font-body">
              <li><Link to="/privacy" className="inline-block py-1.5 hover:text-warm-gold transition-colors">{t.footer.privacyPolicy}</Link></li>
              <li><Link to="/terms" className="inline-block py-1.5 hover:text-warm-gold transition-colors">{t.footer.termsOfService}</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-content mx-auto pt-8 border-t border-ivory/10 text-sm font-body text-center">
          &copy; {new Date().getFullYear()} {t.footer.copyright}
        </div>
      </footer>
    </div>
  )
}
