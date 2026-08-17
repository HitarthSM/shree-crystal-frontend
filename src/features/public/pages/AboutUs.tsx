import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CheckCircle2, History, MapPin, Phone, Mail } from 'lucide-react'

export function AboutUs() {
  return (
    <div className="space-y-12 animate-fade-slide-up pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      {/* Hero Section */}
      <section className="bg-deep-saffron text-ivory rounded-[6px] p-8 md:p-12 relative overflow-hidden shadow-paper-lg">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #FAF5E8 31px, #FAF5E8 32px)',
          }}
        />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-display-lg font-display mb-6">About Shree Crystal Co-op</h1>
          <p className="text-body-lg text-ivory/90 font-body">
            Founded in 1985, Shree Crystal Co-operative Society has been dedicated to serving its members 
            with transparency, trust, and secure financial management. 
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md" className="border-mahogany-muted/20 hover:border-warm-gold/50 transition-colors">
          <div className="h-10 w-10 bg-warm-gold/10 text-warm-gold rounded-full flex items-center justify-center mb-4">
            <History className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl text-dark-mahogany mb-2">Heritage</h3>
          <p className="text-sm font-body text-mahogany-muted">
            Over three decades of unbroken trust and financial stability serving the community.
          </p>
        </Card>

        <Card padding="md" className="border-mahogany-muted/20 hover:border-warm-gold/50 transition-colors">
          <div className="h-10 w-10 bg-verdant-green/10 text-verdant-green rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <h3 className="font-display text-xl text-dark-mahogany mb-2">Transparency</h3>
          <p className="text-sm font-body text-mahogany-muted">
            Digitised passbooks and instant notifications ensure complete visibility of your deposits.
          </p>
        </Card>

        <Card padding="md" className="border-mahogany-muted/20 hover:border-warm-gold/50 transition-colors">
          <div className="h-10 w-10 bg-deep-crimson/10 text-deep-crimson rounded-full flex items-center justify-center mb-4">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h3 className="font-display text-xl text-dark-mahogany mb-2">Security</h3>
          <p className="text-sm font-body text-mahogany-muted">
            Modern, robust security protocols protect both your data and your financial assets.
          </p>
        </Card>
      </section>

      {/* Contact Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card padding="none" className="overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-ledger-rule bg-deep-saffron/5">
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-warm-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-dark-mahogany mb-1">Registered Office</p>
                <p className="text-sm text-mahogany-muted font-body">
                  101, Crystal Complex, Near SG Highway,<br />
                  Ahmedabad, Gujarat, 380054
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-warm-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-dark-mahogany mb-1">Phone Numbers</p>
                <p className="text-sm text-mahogany-muted font-body">
                  +91 79 1234 5678 (Office)<br />
                  +91 98765 43210 (Support)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-warm-gold mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-dark-mahogany mb-1">Email</p>
                <p className="text-sm text-mahogany-muted font-body">
                  support@shreecrystal.local<br />
                  admin@shreecrystal.local
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card padding="none" className="overflow-hidden">
          <CardHeader className="p-6 pb-4 border-b border-ledger-rule bg-deep-saffron/5">
            <CardTitle>Office Hours</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-ledger-rule">
              <div className="px-6 py-4 flex justify-between items-center hover:bg-warm-gold/5 transition-colors">
                <span className="font-body text-dark-mahogany">Monday - Friday</span>
                <span className="font-data text-mahogany-muted text-sm">10:00 AM - 5:30 PM</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center hover:bg-warm-gold/5 transition-colors">
                <span className="font-body text-dark-mahogany">Saturday (1st & 3rd)</span>
                <span className="font-data text-mahogany-muted text-sm">10:00 AM - 2:00 PM</span>
              </div>
              <div className="px-6 py-4 flex justify-between items-center hover:bg-warm-gold/5 transition-colors">
                <span className="font-body text-deep-crimson">Sunday & Public Holidays</span>
                <span className="font-data text-deep-crimson/80 text-sm">Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
