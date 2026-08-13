import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { Download, AlertCircle } from 'lucide-react'

// Mock Data
const activeLoan = {
  id: 'L-24-089',
  type: 'Personal Loan',
  outstanding: 45000,
  nextEmiDate: '2025-04-05',
  emiAmount: 5200,
}

const recentStatements = [
  { id: 'S-2025-02', period: 'Feb 2025', type: 'Savings', date: '01 Mar 2025', published: true },
  { id: 'S-2025-01', period: 'Jan 2025', type: 'Savings', date: '01 Feb 2025', published: true },
]

export function MemberDashboard() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header>
        <h1 className="text-display-md font-display text-dark-mahogany mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'Member'}
        </h1>
        <p className="text-body text-mahogany-muted">
          Here is a summary of your accounts as of today.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Active Loans & Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg" className="border-t-4 border-t-deep-saffron">
            <CardHeader className="flex flex-row items-center justify-between mb-6">
              <CardTitle>Active Loan Summary</CardTitle>
              <Badge variant="active">Active</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-ledger-rule">
                <div>
                  <p className="text-sm font-body text-mahogany-muted mb-1">{activeLoan.type} • {activeLoan.id}</p>
                  <p className="font-data text-[2.5rem] leading-none text-warm-gold font-medium">
                    {formatINR(activeLoan.outstanding)}
                  </p>
                  <p className="text-sm font-body text-dark-mahogany mt-2">Outstanding Principal</p>
                </div>
                <div className="bg-ivory-darker rounded-[4px] p-4 min-w-[200px]">
                  <p className="text-sm font-body text-mahogany-muted mb-1">Next EMI Due</p>
                  <p className="font-data text-lg text-dark-mahogany mb-1">{formatINR(activeLoan.emiAmount)}</p>
                  <p className="font-data text-sm text-deep-crimson flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" />
                    Due on {new Date(activeLoan.nextEmiDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button variant="primary">Pay EMI Online</Button>
                <Button variant="secondary">View Schedule</Button>
              </div>
            </CardContent>
          </Card>

          <Card padding="none">
            <CardHeader className="p-6 pb-2">
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              <LedgerRow
                stamped
                title="EMI Payment Received"
                subtitle="Online transfer via UPI"
                date="05 Mar 2025"
                mono={<span className="text-verdant-green">+{formatINR(5200)}</span>}
              />
              <LedgerRow
                stamped
                title="Dividend Credited"
                subtitle="FY 2023-24"
                date="02 Mar 2025"
                mono={<span className="text-verdant-green">+{formatINR(1250)}</span>}
              />
              <LedgerRow
                title="Interest Capitalised"
                subtitle="Fixed Deposit FD-992"
                date="31 Dec 2024"
                mono={<span className="text-verdant-green">+{formatINR(340)}</span>}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Statements & Notices */}
        <div className="space-y-6">
          <Card padding="none">
            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-ledger-rule">
              <CardTitle className="text-lg">Latest Statements</CardTitle>
              <Link to="/dashboard/statements" className="text-sm font-medium text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentStatements.map((stmt) => (
                <LedgerRow
                  key={stmt.id}
                  stamped={stmt.published}
                  title={`${stmt.type} Statement`}
                  subtitle={stmt.period}
                  className="px-6"
                  mono={
                    <button className="p-2 text-mahogany-muted hover:text-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm" aria-label={`Download statement for ${stmt.period}`}>
                      <Download className="h-4 w-4" />
                    </button>
                  }
                />
              ))}
            </CardContent>
          </Card>

          <Card padding="none" className="bg-ivory">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg">Important Notices</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="p-4 rounded-[4px] bg-white border border-ledger-rule shadow-paper relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-deep-crimson rounded-l-[4px]" />
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="urgent">Urgent</Badge>
                  <span className="font-data text-xs text-mahogany-muted">Today</span>
                </div>
                <h4 className="font-body font-medium text-dark-mahogany text-sm mb-1">
                  KYC Update Required
                </h4>
                <p className="font-body text-sm text-mahogany-muted">
                  Please submit your updated Aadhaar card copy to the branch before 31st March 2025.
                </p>
              </div>

              <div className="p-4 rounded-[4px] bg-white border border-ledger-rule shadow-paper">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="agm">AGM</Badge>
                  <span className="font-data text-xs text-mahogany-muted">15 Mar</span>
                </div>
                <h4 className="font-body font-medium text-dark-mahogany text-sm mb-1">
                  Annual General Meeting
                </h4>
                <p className="font-body text-sm text-mahogany-muted">
                  The 40th AGM will be held at Town Hall. All members are requested to attend.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
