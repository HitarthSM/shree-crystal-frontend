import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { LinkButton } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import { formatINR } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { Download } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDistanceToNow, format } from 'date-fns'
import type { MemberDashboardData } from '@/types/dashboard'

export function MemberDashboardPage() {
  const { user } = useAuthStore()
  const { data, isLoading, isError, refetch, isRefetching } = useQuery<MemberDashboardData>({
    queryKey: ['memberDashboard'],
    queryFn: () => apiClient.get('/members/me/dashboard').then(res => res.data)
  })

  const { data: memberProfile } = useQuery({
    queryKey: ['memberProfile'],
    queryFn: () => apiClient.get('/members/me').then(res => res.data),
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
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load your account summary"
        description="We could not reach the server. Your balance is not shown until it loads."
        onRetry={() => refetch()}
        isRetrying={isRefetching}
      />
    )
  }

  const { latestLoan, latestStatement, recentNotices, openQueryCount = 0 } = data || {}

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Member'}`}
        description="Here is an easy overview of your accounts and recent activity as of today."
      />

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
                        {formatINR(latestLoan.outstandingAmount)}
                      </p>
                      <p className="text-sm font-body text-dark-mahogany mt-2">Remaining Loan Balance</p>
                    </div>
                    <p className="text-sm font-body text-mahogany-muted max-w-xs">
                      Your repayment schedule will appear here once it is available. Until then,
                      pay using the society&apos;s payment details.
                    </p>
                  </div>

                </>
              ) : (
                <EmptyState
                  icon="file"
                  title="No Active Loans"
                  description="You do not have any active loans with the society right now."
                />
              )}
            </CardContent>
          </Card>

          <Card padding="none">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
              <CardTitle>Account Activity</CardTitle>
              <Link to="/dashboard/statements" className="text-xs font-semibold text-warm-gold hover:text-warm-gold-hover">
                View Statements &rarr;
              </Link>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-2">
              {(() => {
                const activities = []

                if (memberProfile?.shareCapital) {
                  activities.push({
                    id: 'share-capital',
                    title: 'Share Capital',
                    subtitle: 'Membership share capital',
                    date: memberProfile.membershipDate
                      ? format(new Date(memberProfile.membershipDate), 'dd MMM yyyy')
                      : 'Joined',
                    amount: Number(memberProfile.shareCapital),
                    isCredit: true,
                    stamped: true,
                  })
                }

                if (latestLoan) {
                  activities.push({
                    id: `loan-${latestLoan.id}`,
                    title: `${latestLoan.type || 'Loan'} outstanding`,
                    subtitle: `Account #${latestLoan.id}`,
                    date: latestLoan.createdAt
                      ? format(new Date(latestLoan.createdAt), 'dd MMM yyyy')
                      : 'Recent',
                    amount: latestLoan.outstandingAmount,
                    isCredit: false,
                    stamped: true,
                  })
                }

                if (activities.length === 0) {
                  return (
                    <div className="py-6 text-center text-sm font-body text-mahogany-muted">
                      Nothing to show yet.
                    </div>
                  )
                }

                return activities.map((act) => (
                  <LedgerRow
                    key={act.id}
                    stamped={act.stamped}
                    title={act.title}
                    subtitle={act.subtitle}
                    date={act.date}
                    mono={
                      <span className={act.isCredit ? 'text-verdant-green font-semibold' : 'text-deep-crimson font-semibold'}>
                        {formatINR(act.amount)}
                      </span>
                    }
                  />
                ))
              })()}
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
                recentNotices.map((item) => {
                  const title = item.notice?.title || item.title || 'Society Notice'
                  const body = item.notice?.body || item.notice?.content || item.body || item.content || ''
                  const category = ((item.notice?.category || item.category || 'GENERAL') as string).toUpperCase()
                  const noticeDate = item.notice?.publishedAt || item.notice?.createdAt || item.publishedAt || item.createdAt
                  const validDate = noticeDate && !isNaN(new Date(noticeDate).getTime())
                  const priority = item.notice?.priority || item.priority
                  const isUrgent = category === 'URGENT' || priority === 'HIGH'
                  const noticeId = item.notice?.id || item.id

                  return (
                    <div key={noticeId} className="p-4 rounded-[4px] bg-white border border-ledger-rule shadow-paper relative">
                      {isUrgent && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-deep-crimson rounded-l-[4px]" />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={isUrgent ? 'urgent' : category === 'AGM' ? 'agm' : 'general'}>
                          {category}
                        </Badge>
                        <span className="font-data text-xs text-mahogany-muted">
                          {validDate && noticeDate ? formatDistanceToNow(new Date(noticeDate), { addSuffix: true }) : 'Recent'}
                        </span>
                      </div>
                      <h4 className="font-body font-medium text-dark-mahogany text-sm mb-1">
                        {title}
                      </h4>
                      <p className="font-body text-sm text-mahogany-muted line-clamp-2">
                        {body}
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
                <div className="ml-auto">
                  <LinkButton to="/dashboard/support" variant="secondary" size="sm">
                    View Questions
                  </LinkButton>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
