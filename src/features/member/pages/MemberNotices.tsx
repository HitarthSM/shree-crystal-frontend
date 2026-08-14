import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { format } from 'date-fns'

export function MemberNotices() {
  const { data: notices, isLoading } = useQuery({ queryKey: ['memberNotices'], queryFn: () => apiClient.get('/notices/me').then(r => r.data) })
  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header>
        <h1 className="text-display-md font-display text-dark-mahogany mb-1">
          Notices & Circulars
        </h1>
        <p className="text-body text-mahogany-muted">
          Important updates and announcements from the society.
        </p>
      </header>

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule">
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-mahogany-muted font-body">Loading notices...</div>
          ) : notices && notices.length > 0 ? (
            <div className="divide-y divide-ledger-rule">
              {notices.map((delivery: any) => (
                <div key={delivery.id} className={`p-6 transition-colors ${delivery.status !== 'DELIVERED' ? 'bg-deep-saffron/5' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={delivery.notice.priority === 'HIGH' ? 'urgent' : delivery.notice.category === 'AGM' ? 'agm' : 'general'}>
                        {delivery.notice.priority === 'HIGH' ? 'URGENT' : delivery.notice.category || 'GENERAL'}
                      </Badge>
                      <h3 className="font-body font-medium text-dark-mahogany text-lg">
                        {delivery.notice.title}
                      </h3>
                    </div>
                    <span className="font-data text-sm text-mahogany-muted whitespace-nowrap">
                      {format(new Date(delivery.notice.publishedAt || delivery.notice.createdAt), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <p className="font-body text-mahogany-muted mb-4 max-w-3xl">
                    {delivery.notice.content || delivery.notice.body}
                  </p>
                  {delivery.notice.attachmentUrl && (
                    <a 
                      href={delivery.notice.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      View Full Circular
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-mahogany-muted font-body">
              No notices available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
