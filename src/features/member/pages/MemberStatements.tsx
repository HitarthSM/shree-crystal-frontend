import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/FormControls'
import { EmptyState } from '@/components/ui/EmptyState'
import { Download, Printer } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { format } from 'date-fns'
import { toast } from '@/components/ui/Toast'

export function MemberStatements() {
  const [filterType, setFilterType] = useState('all')

  const { data: statements, isLoading } = useQuery({
    queryKey: ['memberStatements'],
    queryFn: () => apiClient.get('/statements/me').then(r => r.data)
  })
  const downloadMutation = useMutation({
    mutationFn: async ({ id, periodStart }: { id: string; periodStart: string }) => {
      const res = await apiClient.get(`/statements/me/${id}/download`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `statement_${new Date(periodStart).toISOString().slice(0, 7)}.pdf`
      document.body.appendChild(a); a.click(); a.remove()
    }
  })

  const handleDownload = async (id: string, periodStart: string) => {
    try {
      await downloadMutation.mutateAsync({ id, periodStart })
      toast.success('Statement downloaded successfully')
    } catch (err) {
      toast.error('Failed to download statement')
    }
  }

  const filteredStatements = (statements || []).filter(
    (s: any) => filterType === 'all' || s.accountType === filterType
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
          {isLoading ? (
            <div className="p-8 text-center text-mahogany-muted font-body">Loading statements...</div>
          ) : filteredStatements.length > 0 ? (
            <div className="divide-y divide-ledger-rule">
              {filteredStatements.map((stmt: any) => (
                <LedgerRow
                  key={stmt.id}
                  stamped={stmt.status === 'PUBLISHED'}
                  title={`${stmt.accountType === 'SAVINGS' ? 'Savings Account' : 'Loan Account'}`}
                  subtitle={`Statement for ${format(new Date(stmt.periodStart), 'MMMM yyyy')} • Published ${format(new Date(stmt.publishedAt), 'dd MMM yyyy')}`}
                  className="px-6 py-4"
                  mono={
                    <button 
                      onClick={() => handleDownload(stmt.id, stmt.periodStart)}
                      disabled={downloadMutation.isPending}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-body font-medium text-warm-gold hover:bg-warm-gold/5 border border-warm-gold/20 hover:border-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm disabled:opacity-50"
                      aria-label={`Download statement for ${format(new Date(stmt.periodStart), 'MMMM yyyy')}`}
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
