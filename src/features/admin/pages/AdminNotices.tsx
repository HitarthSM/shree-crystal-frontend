
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'

// Mock Data
const notices = [
  {
    id: 'N-2025-015',
    title: 'KYC Update Required',
    date: '10 Mar 2025',
    type: 'urgent',
    status: 'published',
    target: 'All Members',
  },
  {
    id: 'N-2025-012',
    title: 'Annual General Meeting',
    date: '01 Mar 2025',
    type: 'agm',
    status: 'published',
    target: 'All Members',
  },
  {
    id: 'N-2025-016',
    title: 'Upcoming Holiday Closure',
    date: '12 Mar 2025',
    type: 'general',
    status: 'draft',
    target: 'All Members',
  },
]

export function AdminNotices() {
  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Notices & Circulars
          </h1>
          <p className="text-body text-mahogany-muted">
            Manage public and member-only announcements.
          </p>
        </div>
        
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          Draft Notice
        </Button>
      </header>

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule">
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {notices.map((notice) => (
              <LedgerRow
                key={notice.id}
                stamped={notice.status === 'published'}
                title={notice.title}
                subtitle={`Target: ${notice.target}`}
                date={notice.date}
                className="px-6 py-4"
                badge={
                  <div className="flex gap-2">
                    <Badge variant={notice.type as any}>{notice.type.toUpperCase()}</Badge>
                    {notice.status === 'draft' && <Badge variant="pending">DRAFT</Badge>}
                  </div>
                }
                mono={
                  <div className="flex gap-2">
                    <button className="p-1.5 text-mahogany-muted hover:text-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-mahogany-muted hover:text-dark-mahogany transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-mahogany-muted hover:text-deep-crimson transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
