import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/FormControls'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { calculateEMI, formatINR } from '@/lib/utils'
import { Calculator } from 'lucide-react'

export function LandingPage() {
  const [principal, setPrincipal] = useState('500000')
  const [months, setMonths] = useState('60')
  const [rate, setRate] = useState('9.5')

  const { data: aboutData } = useQuery({
    queryKey: ['public.content.about_us'],
    queryFn: () => apiClient.get('/public/content/public.content.about_us').then(res => res.data),
  })

  const aboutText = aboutData?.text || 'Shree Crystal Co-op has been the financial backbone of our local community for over three decades, offering secure savings and accessible credit with unparalleled transparency.'

  const emi = calculateEMI(Number(principal), Number(rate), Number(months))

  return (
    <div className="bg-ivory pb-20">
      {/* Hero Section */}
      <section className="bg-deep-saffron relative overflow-hidden">
        <div className="max-w-content mx-auto px-6 lg:px-8 py-24 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-display-lg font-display text-ivory animate-hero leading-tight">
              Trusted by your community.<br />Built on integrity.
            </h1>
            <p className="text-body-lg text-ivory/80 max-w-lg animate-hero-delayed">
              Your passbook, digitised — serving members with transparency and dedication since 1985.
            </p>
            <div className="pt-4 animate-hero-btn">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-[4px] transition-all duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 bg-warm-gold text-white hover:bg-warm-gold-hover h-12 px-6 text-base">
                Member Login
              </Link>
            </div>
          </div>
          
          <div className="flex-1 animate-hero-delayed opacity-90 hidden md:block">
            {/* SVG Illustration of Ledger rows with stamp rings */}
            <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-xl" aria-hidden="true">
              <rect x="0" y="0" width="400" height="300" fill="#FAF5E8" rx="8" />
              {/* Rows */}
              {[1, 2, 3, 4, 5].map((i) => (
                <g key={i} transform={`translate(0, ${i * 45 + 20})`}>
                  <line x1="20" y1="0" x2="380" y2="0" stroke="rgba(44,26,14,0.12)" strokeWidth="1" />
                  {i % 2 !== 0 && (
                    <>
                      <circle cx="45" cy="-22" r="10" stroke="#C8862C" strokeWidth="2" fill="none" />
                      <circle cx="45" cy="-22" r="8" fill="#C8862C" />
                    </>
                  )}
                  <rect x="75" y="-28" width={120 + (i * 15 % 50)} height="12" fill="rgba(44,26,14,0.6)" rx="2" />
                  <rect x="75" y="-10" width={80 + (i * 20 % 40)} height="8" fill="rgba(44,26,14,0.3)" rx="2" />
                  <rect x="310" y="-26" width="50" height="12" fill="#C8862C" rx="2" />
                </g>
              ))}
            </svg>
          </div>
        </div>
        {/* Decorative gold rule at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-gold" />
      </section>

      {/* Main Content Grid */}
      <section className="max-w-content mx-auto px-6 lg:px-8 mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left Column: About & Notices */}
        <div className="space-y-16">
          {/* About Section */}
          <div className="space-y-6">
            <h2 className="text-display-md font-display text-dark-mahogany">About the Society</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2 font-data text-sm text-mahogany-muted">
                <p><span className="text-dark-mahogany font-medium">Reg No:</span> B/26456/1985</p>
                <p><span className="text-dark-mahogany font-medium">Founded:</span> 15 March 1985</p>
                <p><span className="text-dark-mahogany font-medium">Members:</span> 1,847 Active</p>
                <p><span className="text-dark-mahogany font-medium">Auditor:</span> V.K. Shah & Co.</p>
              </div>
              <div className="text-body font-body text-dark-mahogany whitespace-pre-wrap">
                {aboutText}
              </div>
            </div>
          </div>

          {/* Notices Section */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-display-md font-display text-dark-mahogany">Latest Notices</h2>
              <Link to="/notices" className="text-warm-gold hover:text-warm-gold-hover font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm mb-1">
                View all notices →
              </Link>
            </div>
            
            <div className="border border-ledger-rule rounded-[6px] bg-white overflow-hidden shadow-paper">
              <LedgerRow
                stamped
                title="Annual General Meeting 2025"
                badge={<Badge variant="agm">AGM</Badge>}
                date="15 Mar 2025"
              />
              <LedgerRow
                title="Revision of Fixed Deposit Interest Rates"
                badge={<Badge variant="general">General</Badge>}
                date="10 Mar 2025"
              />
              <LedgerRow
                stamped
                title="Dividend Declaration for FY 23-24"
                badge={<Badge variant="general">General</Badge>}
                date="02 Mar 2025"
              />
            </div>
          </div>
        </div>

        {/* Right Column: EMI Calculator */}
        <div>
          <Card padding="lg" className="sticky top-28 border-warm-gold/20 shadow-paper-md">
            <CardHeader className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Calculator className="h-6 w-6 text-warm-gold" />
                <CardTitle>EMI Calculator</CardTitle>
              </div>
              <p className="text-body-sm text-mahogany-muted">Plan your loan repayment schedule.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Loan Amount (₹)"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                min="10000"
                step="10000"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Tenure (Months)"
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  min="1"
                  max="120"
                />
                <Input
                  label="Interest Rate (%)"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  min="1"
                  step="0.1"
                />
              </div>

              <div className="mt-8 p-6 bg-deep-saffron rounded-[6px] text-center">
                <p className="text-ivory/80 text-sm font-medium mb-1">Estimated Monthly EMI</p>
                <p className="text-3xl font-data font-medium text-warm-gold">
                  {formatINR(emi)}
                </p>
              </div>
              <p className="text-xs text-center text-mahogany-muted">
                * This is an estimate. Actual EMI may vary based on exact disbursement date and society rules.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
