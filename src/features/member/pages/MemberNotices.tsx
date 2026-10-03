import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDate } from '@/lib/utils'
import type { Notice } from '@/types/notice'

interface MemberNoticeDelivery {
  id: string
  status: string
  notice: Notice
}

export function MemberNotices() {
  const { data: notices, isLoading } = useQuery<MemberNoticeDelivery[]>({
    queryKey: ['memberNotices'],
    queryFn: () => apiClient.get('/notices/me').then(r => r.data)
  })

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="Notices & Circulars"
        description="Important updates and announcements from the society."
      />

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule">
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : notices && notices.length > 0 ? (
            <div className="divide-y divide-ledger-rule">
              {notices.map((delivery) => (
                <div key={delivery.id} className={`p-6 transition-colors ${delivery.status !== 'DELIVERED' ? 'bg-deep-saffron/5' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={delivery.notice.priority === 'HIGH' ? 'urgent' : delivery.notice.category}>
                        {delivery.notice.priority === 'HIGH' ? 'URGENT' : delivery.notice.category || 'GENERAL'}
                      </Badge>
                      <h3 className="font-body font-medium text-dark-mahogany text-lg">
                        {delivery.notice.title}
                      </h3>
                    </div>
                    <span className="font-data text-sm text-mahogany-muted whitespace-nowrap">
                      {delivery.notice.publishedAt || delivery.notice.createdAt ? formatDate(delivery.notice.publishedAt || delivery.notice.createdAt) : ''}
                    </span>
                  </div>
                  <p className="font-body text-mahogany-muted mb-4 max-w-3xl">
                    {delivery.notice.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No notices found"
              description="No notices have been published to your member account at this time."
              icon="inbox"
              className="m-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
