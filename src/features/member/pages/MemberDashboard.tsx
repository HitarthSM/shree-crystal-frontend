import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { Download, AlertCircle, FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDistanceToNow, format } from 'date-fns'

export function MemberDashboard() {
  const { user } = useAuthStore()
  const { data, isLoading } = useQuery({
    queryKey: ['memberDashboard'],
    queryFn: () => apiClient.get('/members/me/dashboard').then(res => res.data)
  })
  
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-slide-up">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200/60 animate-pulse rounded-[4px]" />
          <div className="h-4 w-96 bg-slate-200/40 animate-pulse rounded-[4px]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-slate-200/50 animate-pulse rounded-[6px]" />
            <div className="h-48 bg-slate-200/50 animate-pulse rounded-[6px]" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-slate-200/50 animate-pulse rounded-[6px]" />
            <div className="h-64 bg-slate-200/50 animate-pulse rounded-[6px]" />
          </div>
        </div>
      </div>
    )
  }

  const { latestLoan, latestStatement, recentNotices, openQueryCount } = data || {}

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header>
        <h1 className="text-display-md font-display text-dark-mahogany mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'Member'}
        </h1>
        <p className="text-body text-mahogany-muted">
          Here is an easy overview of your accounts and recent activity as of today.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Column: Active Loans & Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg" className="border-t-4 border-t-deep-saffron">
            <CardHeader className="flex flex-row items-center justify-between mb-6">
              <h2 className="font-display text-xl text-dark-mahogany font-medium">My Loan Account</h2>
              {latestLoan ? <Badge variant="active">Active</Badge> : <Badge variant="pending">No Active Loans</Badge>}
            </CardHeader>
            <CardContent>
              {latestLoan ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-ledger-rule">
                    <div>
                      <p className="text-sm font-body text-mahogany-muted mb-1">{latestLoan.type || 'Personal Loan'} • {latestLoan.id}</p>
                      <p className="font-data text-[2.5rem] leading-none text-warm-gold font-medium">
                        {formatINR(latestLoan.outstandingPrincipal || 0)}
                      </p>
                      <p className="text-sm font-body text-dark-mahogany mt-2">Remaining Loan Balance</p>
                    </div>
                    <div className="bg-ivory-darker rounded-[4px] p-4 min-w-[200px]">
                      <p className="text-sm font-body text-mahogany-muted mb-1">Next Monthly EMI Due</p>
                      <p className="font-data text-lg text-dark-mahogany mb-1">{formatINR(latestLoan.emiAmount || 0)}</p>
                      <p className="font-data text-sm text-deep-crimson flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3" />
                        Due on {latestLoan.nextEmiDate ? format(new Date(latestLoan.nextEmiDate), 'dd MMM yyyy') : 'TBD'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <Button variant="primary">Pay EMI Online</Button>
                    <Button variant="secondary">View Payment Plan</Button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center flex flex-col items-center border border-dashed border-ledger-rule rounded bg-ivory/50">
                  <div className="h-12 w-12 rounded-full bg-deep-saffron/10 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-deep-saffron" />
                  </div>
                  <h3 className="font-display text-lg text-dark-mahogany mb-1">No Active Loans</h3>
                  <p className="font-body text-sm text-mahogany-muted mb-4 max-w-sm">
                    You do not have any active loans with the society right now.
                  </p>
                  <Button variant="primary">Apply for a Loan</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card padding="none">
            <CardHeader className="p-6 pb-2">
              <CardTitle>Recent Passbook Activity</CardTitle>
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
              <CardTitle className="text-lg">Latest Passbook Statement</CardTitle>
              <Link to="/dashboard/statements" className="text-sm font-medium text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {latestStatement ? (
                <LedgerRow
                  stamped={latestStatement.status === 'PUBLISHED'}
                  title={latestStatement.category ? `${latestStatement.category} Statement` : 'Account Statement'}
                  subtitle={`Period: ${latestStatement.period || 'Current Period'}`}
                  className="px-6 border-b-0"
                  mono={
                    <Link
                      to="/dashboard/statements"
                      className="p-2 text-mahogany-muted hover:text-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm inline-flex items-center"
                      aria-label="View statements"
                    >
                      <Download className="h-4 w-4" />
                    </Link>
                  }
                />
              ) : (
                <div className="p-6 text-center text-mahogany-muted text-sm font-body">
                  No statements available yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card padding="none" className="bg-ivory">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg">Important Society Notices</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {recentNotices && recentNotices.length > 0 ? (
                recentNotices.map((item: any) => {
                  const notice = item.notice || item
                  const category = (notice.category || 'GENERAL').toUpperCase()
                  const noticeDate = notice.publishedAt || notice.createdAt
                  const validDate = noticeDate && !isNaN(new Date(noticeDate).getTime())
                  const isUrgent = category === 'URGENT' || notice.priority === 'HIGH'
                  return (
                    <div key={item.id || notice.id} className="p-4 rounded-[4px] bg-white border border-ledger-rule shadow-paper relative">
                      {isUrgent && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-deep-crimson rounded-l-[4px]" />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={isUrgent ? 'urgent' : category === 'AGM' ? 'agm' : 'general'}>
                          {category}
                        </Badge>
                        <span className="font-data text-xs text-mahogany-muted">
                          {validDate ? formatDistanceToNow(new Date(noticeDate), { addSuffix: true }) : 'Recent'}
                        </span>
                      </div>
                      <h4 className="font-body font-medium text-dark-mahogany text-sm mb-1">
                        {notice.title}
                      </h4>
                      <p className="font-body text-sm text-mahogany-muted line-clamp-2">
                        {notice.body || notice.content}
                      </p>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-4 text-sm text-mahogany-muted font-body">
                  No new notices at this time.
                </div>
              )}
            </CardContent>
          </Card>

          {openQueryCount > 0 && (
            <Card padding="lg" className="bg-deep-saffron/10 border-deep-saffron/30">
              <div className="flex items-center gap-4">
                <div className="bg-deep-saffron text-ivory rounded-full p-2 h-10 w-10 flex items-center justify-center font-data font-bold">
                  {openQueryCount}
                </div>
                <div>
                  <h4 className="font-display font-medium text-dark-mahogany">Pending Help Questions</h4>
                  <p className="text-sm font-body text-mahogany-muted">Our office team is currently looking into your questions.</p>
                </div>
                <Link to="/dashboard/support" className="ml-auto">
                  <Button variant="secondary" size="sm">View Questions</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

      </div>
    </div>
  )
}
