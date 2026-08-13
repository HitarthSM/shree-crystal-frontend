import { Outlet, Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Fixed Nav */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-deep-saffron z-50 px-6 lg:px-8 border-b border-deep-saffron-light">
        <div className="max-w-content mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-ivory group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-4 focus-visible:ring-offset-deep-saffron rounded-sm">
            <Building2 className="h-8 w-8 text-warm-gold group-hover:text-warm-gold-light transition-colors" />
            <span className="font-display font-bold text-xl tracking-wide">Shree Crystal Co-op</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/notices" className="nav-link">Public Notices</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <div className="w-px h-6 bg-ivory/20 mx-2" />
            <Link to="/login" className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-[4px] transition-all duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 bg-warm-gold text-white hover:bg-warm-gold-hover h-11 px-4 text-base">
              Member Login
            </Link>
          </nav>

          {/* Mobile menu button could go here */}
        </div>
      </header>

      {/* Main Content (padded for fixed header) */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-deep-saffron border-t border-warm-gold pt-12 pb-8 px-6 lg:px-8 text-ivory/80">
        <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">Shree Crystal Co-op</h4>
            <p className="font-body text-sm mb-2">Registration No. B/26456/1985</p>
            <p className="font-body text-sm">Serving the community with transparency and integrity for over 35 years.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link to="/about" className="hover:text-warm-gold transition-colors">About Us</Link></li>
              <li><Link to="/notices" className="hover:text-warm-gold transition-colors">Notices</Link></li>
              <li><Link to="/contact" className="hover:text-warm-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-ivory mb-4">Legal</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link to="/privacy" className="hover:text-warm-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-warm-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-content mx-auto pt-8 border-t border-ivory/10 text-sm font-body text-center">
          &copy; {new Date().getFullYear()} Shree Crystal Co-op Credit and Consumers Society Limited. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
