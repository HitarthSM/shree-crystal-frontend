import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/FormControls'
import { EmptyState } from '@/components/ui/EmptyState'
import { Download, Printer } from 'lucide-react'

// Mock Data
const statements = [
  { id: 'S-2025-02', period: 'Feb 2025', type: 'Savings Account', date: '01 Mar 2025', published: true },
  { id: 'S-2025-01', period: 'Jan 2025', type: 'Savings Account', date: '01 Feb 2025', published: true },
  { id: 'L-2025-02', period: 'Feb 2025', type: 'Personal Loan L-24-089', date: '01 Mar 2025', published: true },
  { id: 'L-2025-01', period: 'Jan 2025', type: 'Personal Loan L-24-089', date: '01 Feb 2025', published: true },
  { id: 'L-2024-12', period: 'Dec 2024', type: 'Personal Loan L-24-089', date: '01 Jan 2025', published: true },
]

export function MemberStatements() {
  const [filterType, setFilterType] = useState('all')

  const filteredStatements = statements.filter(
    (s) => filterType === 'all' || s.type.includes(filterType)
  )

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            My Statements
          </h1>
          <p className="text-body text-mahogany-muted">
            Download your monthly statements and interest certificates.
          </p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select
            label="Filter by Account"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[
              { value: 'all', label: 'All Accounts' },
              { value: 'Savings', label: 'Savings Account' },
              { value: 'Loan', label: 'Loan Accounts' },
            ]}
          />
        </div>
      </header>

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CardTitle>Statement Archive</CardTitle>
            <Badge variant="published">{filteredStatements.length} Records</Badge>
          </div>
          <button className="text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm px-2 py-1">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print List</span>
          </button>
        </CardHeader>
        
        <CardContent className="p-0">
          {filteredStatements.length > 0 ? (
            <div className="divide-y divide-ledger-rule">
              {filteredStatements.map((stmt) => (
                <LedgerRow
                  key={stmt.id}
                  stamped={stmt.published}
                  title={stmt.type}
                  subtitle={`Statement for ${stmt.period} • Generated ${stmt.date}`}
                  className="px-6 py-4"
                  mono={
                    <button 
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-body font-medium text-warm-gold hover:bg-warm-gold/5 border border-warm-gold/20 hover:border-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm"
                      aria-label={`Download statement for ${stmt.period}`}
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </button>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No statements found"
              description="There are no statements matching your current filter criteria."
              icon="file"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
