import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Bell, Calendar, FileText } from 'lucide-react'

// Placeholder data since public backend endpoint isn't built yet
const MOCK_PUBLIC_NOTICES = [
  {
    id: 'not_1',
    title: 'Annual General Meeting 2024-2025',
    date: 'March 15, 2025',
    category: 'agm',
    isUrgent: true,
  },
  {
    id: 'not_2',
    title: 'Update on Fixed Deposit Interest Rates',
    date: 'February 28, 2025',
    category: 'general',
    isUrgent: false,
  },
  {
    id: 'not_3',
    title: 'Holiday Notice: Mahashivratri',
    date: 'February 24, 2025',
    category: 'general',
    isUrgent: false,
  },
  {
    id: 'not_4',
    title: 'New Loan Disbursement Guidelines',
    date: 'January 10, 2025',
    category: 'policy',
    isUrgent: false,
  }
]

export function PublicNotices() {
  return (
    <div className="space-y-8 animate-fade-slide-up pb-12 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-display-md font-display text-dark-mahogany">
          Public Notices
        </h1>
        <p className="text-body text-mahogany-muted">
          Important announcements and updates from the society board.
        </p>
      </header>

      <Card padding="none" className="shadow-paper-md">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center bg-ivory/50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-deep-saffron" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {MOCK_PUBLIC_NOTICES.map((notice) => (
              <LedgerRow
                key={notice.id}
                title={notice.title}
                subtitle={
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {notice.date}
                    </span>
                    {notice.category === 'agm' && <Badge variant="agm">AGM</Badge>}
                    {notice.isUrgent && <Badge variant="urgent">Important</Badge>}
                  </div>
                }
                date=""
                className="px-6 py-4 hover:bg-warm-gold/5 transition-colors cursor-pointer"
                mono={
                  <button className="flex flex-col items-center justify-center h-10 w-10 rounded-full hover:bg-warm-gold/10 text-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold">
                    <FileText className="h-5 w-5" />
                    <span className="text-[10px] mt-0.5 font-body">View</span>
                  </button>
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <p className="text-sm text-mahogany-muted font-body">
          To view members-only notices and personal statements, please <a href="/login" className="text-warm-gold hover:underline">login to your account</a>.
        </p>
      </div>
    </div>
  )
}
