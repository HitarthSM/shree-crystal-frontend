import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { Bell, Calendar, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDate } from '@/lib/utils'
import type { Notice } from '@/types/notice'

export function PublicNotices() {
  const { data: noticesData, isLoading } = useQuery<{ items?: Notice[]; data?: Notice[] } | Notice[]>({
    queryKey: ['publicNotices'],
    queryFn: () => apiClient.get('/notices').then(res => res.data)
  })
  
  const notices: Notice[] = Array.isArray(noticesData)
    ? noticesData
    : noticesData?.items || noticesData?.data || []

  return (
    <div className="space-y-8 animate-fade-slide-up pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <PageHeader
        title="Public Notices"
        description="Important announcements and updates from the society board."
      />

      <Card padding="none" className="shadow-paper-md">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center bg-ivory/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-deep-saffron" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : notices.length === 0 ? (
            <div className="p-8 text-center text-mahogany-muted font-body">No public notices available.</div>
          ) : (
            <div className="divide-y divide-ledger-rule">
              {notices.map((notice) => (
                <LedgerRow
                  key={notice.id}
                  title={notice.title}
                  subtitle={
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-mahogany-muted font-data">
                        <Calendar className="h-3 w-3" />
                        {notice.createdAt ? formatDate(notice.createdAt) : ''}
                      </span>
                      <Badge variant={notice.priority === 'HIGH' ? 'urgent' : notice.category}>
                        {notice.priority === 'HIGH' ? 'Important' : notice.category}
                      </Badge>
                    </div>
                  }
                  date=""
                  className="px-6 py-4 hover:bg-warm-gold/5 transition-colors cursor-pointer"
                  mono={
                    <div className="flex flex-col items-center justify-center h-10 w-10 rounded-full text-warm-gold">
                      <FileText className="h-5 w-5" />
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <p className="text-sm text-mahogany-muted font-body">
          To view members-only notices and personal statements, please{' '}
          <Link to="/login" className="text-warm-gold hover:underline font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-xs">
            sign in to your account
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
