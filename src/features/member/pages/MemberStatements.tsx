import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/FormControls'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { Download, Printer } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { toast } from '@/components/ui/Toast'
import { downloadBlob, formatDate } from '@/lib/utils'
import type { StatementItem } from '@/types/statement'

export function MemberStatements() {
  const [filterType, setFilterType] = useState('all')

  const { data: statementsData, isLoading } = useQuery<{ data?: StatementItem[] } | StatementItem[]>({
    queryKey: ['memberStatements'],
    queryFn: () => apiClient.get('/statements/me').then(r => r.data)
  })

  const rawStatements: StatementItem[] = Array.isArray(statementsData) 
    ? statementsData 
    : (statementsData?.data || [])

  const downloadMutation = useMutation({
    mutationFn: async ({ id, period }: { id: string; period: string }) => {
      const res = await apiClient.get(`/statements/me/${id}/download`, { responseType: 'blob' })
      const safePeriod = period ? period.replace(/[^a-zA-Z0-9_-]/g, '_') : id
      downloadBlob(new Blob([res.data]), `statement_${safePeriod}.pdf`)
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
    (s) => filterType === 'all' || (s.category && s.category.toUpperCase() === filterType.toUpperCase())
  )

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="My Passbook Statements"
        description="View and download your official monthly passbook statements."
        actions={
          <div className="w-full sm:w-64">
            <Select
              label=""
              aria-label="Choose Account Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all', label: 'All Accounts' },
                { value: 'Savings', label: 'Savings Account' },
                { value: 'Loan', label: 'Loan Accounts' },
              ]}
            />
          </div>
        }
      />

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CardTitle>All Monthly Statements</CardTitle>
            <Badge variant="published">{filteredStatements.length} Statements</Badge>
          </div>
          <button
            onClick={() => window.print()}
            className="text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm px-2 py-1 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print Statement List</span>
          </button>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          ) : filteredStatements.length > 0 ? (
            <div className="divide-y divide-ledger-rule">
              {filteredStatements.map((stmt) => (
                <LedgerRow
                  key={stmt.id}
                  stamped={stmt.status === 'PUBLISHED'}
                  title={`${stmt.category || 'General'} Statement - ${stmt.period}`}
                  subtitle={`Status: ${stmt.status}`}
                  date={stmt.createdAt ? formatDate(stmt.createdAt) : ''}
                  className="px-6 py-4"
                  badge={<Badge variant={stmt.status === 'PUBLISHED' ? 'published' : 'pending'}>{stmt.status}</Badge>}
                  mono={
                    <button
                      onClick={() => handleDownload(stmt.id, stmt.period)}
                      disabled={downloadMutation.isPending}
                      aria-label={`Download statement for ${stmt.period}`}
                      className="p-2 text-mahogany-muted hover:text-warm-gold hover:bg-warm-gold/10 rounded-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No statements found"
              description="There are no statements matching your selected account category."
              icon="file"
              className="m-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
