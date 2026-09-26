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

  const { data: statementsData, isLoading } = useQuery({
    queryKey: ['memberStatements'],
    queryFn: () => apiClient.get('/statements/me').then(r => r.data)
  })

  const rawStatements: any[] = Array.isArray(statementsData) 
    ? statementsData 
    : (statementsData?.data || [])

  const downloadMutation = useMutation({
    mutationFn: async ({ id, period }: { id: string; period: string }) => {
      const res = await apiClient.get(`/statements/me/${id}/download`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      const safePeriod = period ? period.replace(/[^a-zA-Z0-9_-]/g, '_') : id
      a.download = `statement_${safePeriod}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    }
  })

  const handleDownload = async (id: string, period: string) => {
    try {
      await downloadMutation.mutateAsync({ id, period })
      toast.success('Statement downloaded successfully')
    } catch {
      toast.error('Failed to download statement')
    }
  }

  const filteredStatements = rawStatements.filter(
    (s: any) => filterType === 'all' || (s.category && s.category.toUpperCase() === filterType.toUpperCase())
  )

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            My Passbook Statements
          </h1>
          <p className="text-body text-mahogany-muted">
            View and download your official monthly passbook statements.
          </p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select
            label="Choose Account Type"
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
            <CardTitle>All Monthly Statements</CardTitle>
            <Badge variant="published">{filteredStatements.length} Statements</Badge>
          </div>
          <button className="text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm px-2 py-1">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print Statement List</span>
          </button>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-200/60 animate-pulse rounded-[4px]" />
              ))}
            </div>
          ) : filteredStatements.length > 0 ? (
            <div className="divide-y divide-ledger-rule">
              {filteredStatements.map((stmt: any) => {
                const pubDate = stmt.publishedAt ? new Date(stmt.publishedAt) : null
                const validPubDate = pubDate && !isNaN(pubDate.getTime())
                return (
                  <LedgerRow
                    key={stmt.id}
                    stamped={stmt.status === 'PUBLISHED'}
                    title={stmt.category ? `${stmt.category} Statement` : 'Account Statement'}
                    subtitle={`Period: ${stmt.period || 'N/A'}${validPubDate ? ` • Published ${format(pubDate, 'dd MMM yyyy')}` : ''}`}
                    className="px-6 py-4"
                    mono={
                      <button 
                        onClick={() => handleDownload(stmt.id, stmt.period)}
                        disabled={downloadMutation.isPending}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-body font-medium text-warm-gold hover:bg-warm-gold/5 border border-warm-gold/20 hover:border-warm-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm disabled:opacity-50"
                        aria-label={`Download statement for ${stmt.period || 'current period'}`}
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </button>
                    }
                  />
                )
              })}
            </div>
          ) : (
            <EmptyState
              title="No statements found"
              description="No statements match your chosen filter. Try selecting 'All Accounts' above."
              icon="file"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
