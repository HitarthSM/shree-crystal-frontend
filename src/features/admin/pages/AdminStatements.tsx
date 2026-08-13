import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/FormControls'
import { Upload, Filter } from 'lucide-react'

const batches = [
  { id: 'B-2025-02', period: 'Feb 2025', count: 1847, status: 'published', date: '01 Mar 2025' },
  { id: 'B-2025-01', period: 'Jan 2025', count: 1842, status: 'published', date: '01 Feb 2025' },
  { id: 'B-2024-12', period: 'Dec 2024', count: 1840, status: 'published', date: '01 Jan 2025' },
]

export function AdminStatements() {
  const [filter, setFilter] = useState('all')

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Statements Management
          </h1>
          <p className="text-body text-mahogany-muted">
            Upload and publish monthly member statements.
          </p>
        </div>
        
        <Button variant="primary" leftIcon={<Upload className="h-4 w-4" />}>
          Upload New Batch
        </Button>
      </header>

      {/* Upload Zone */}
      <Card padding="lg" className="border-dashed border-2 border-ledger-rule bg-white/40">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="h-12 w-12 rounded-full bg-deep-saffron/10 flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-deep-saffron" />
          </div>
          <h3 className="font-display text-lg text-dark-mahogany mb-2">Upload Statement CSV</h3>
          <p className="text-sm font-body text-mahogany-muted max-w-md mb-6">
            Drag and drop the monthly master CSV exported from WEB-ERP. The system will automatically map records to member accounts.
          </p>
          <Button variant="secondary">Select File</Button>
          <p className="text-xs font-data text-mahogany-muted mt-4">Max file size: 50MB</p>
        </div>
      </Card>

      {/* History */}
      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Batch History</CardTitle>
          <div className="flex items-center gap-3">
            <Select
              label=""
              aria-label="Filter batches"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Batches' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Drafts' },
              ]}
              className="w-40"
            />
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {batches.map((batch) => (
              <LedgerRow
                key={batch.id}
                stamped={batch.status === 'published'}
                title={`Statement Batch: ${batch.period}`}
                subtitle={`Contains ${batch.count} member statements`}
                date={batch.date}
                className="px-6 py-4"
                badge={<Badge variant="published">{batch.status.toUpperCase()}</Badge>}
                mono={
                  <span className="font-data text-sm text-dark-mahogany">{batch.id}</span>
                }
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
