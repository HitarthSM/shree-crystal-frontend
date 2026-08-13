import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText } from 'lucide-react'

// Mock Data
const notices = [
  {
    id: 'N-2025-015',
    title: 'KYC Update Required',
    description: 'Please submit your updated Aadhaar card copy to the branch before 31st March 2025.',
    date: '10 Mar 2025',
    type: 'urgent',
    read: false,
  },
  {
    id: 'N-2025-012',
    title: 'Annual General Meeting',
    description: 'The 40th AGM will be held at Town Hall. All members are requested to attend.',
    date: '01 Mar 2025',
    type: 'agm',
    read: true,
  },
  {
    id: 'N-2025-008',
    title: 'Revision of Fixed Deposit Interest Rates',
    description: 'Interest rates for FDs have been revised upwards by 0.5% for senior citizens.',
    date: '15 Feb 2025',
    type: 'general',
    read: true,
  },
]

export function MemberNotices() {
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
          <div className="divide-y divide-ledger-rule">
            {notices.map((notice) => (
              <div key={notice.id} className={`p-6 transition-colors ${!notice.read ? 'bg-deep-saffron/5' : ''}`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={notice.type as any}>
                      {notice.type.toUpperCase()}
                    </Badge>
                    <h3 className="font-body font-medium text-dark-mahogany text-lg">
                      {notice.title}
                    </h3>
                  </div>
                  <span className="font-data text-sm text-mahogany-muted whitespace-nowrap">
                    {notice.date}
                  </span>
                </div>
                <p className="font-body text-mahogany-muted mb-4 max-w-3xl">
                  {notice.description}
                </p>
                <button className="inline-flex items-center gap-2 text-sm font-medium text-warm-gold hover:text-warm-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm transition-colors">
                  <FileText className="h-4 w-4" />
                  View Full Circular
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
