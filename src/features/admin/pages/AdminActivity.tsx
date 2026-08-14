import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Input, Select } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { Filter, Download } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDistanceToNow, format } from 'date-fns'
import { toast } from '@/components/ui/Toast'

export function AdminActivity() {
  const [filterRole, setFilterRole] = useState('all')
  const [search, setSearch] = useState('')

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['activity', { actorType: filterRole !== 'all' ? filterRole.toUpperCase() : undefined }],
    queryFn: () => apiClient.get('/activity', { params: { actorType: filterRole !== 'all' ? filterRole.toUpperCase() : undefined } }).then(res => res.data)
  })
  
  const exportMutation = useMutation({
    mutationFn: (params: any) => apiClient.get('/activity/export', { params, responseType: 'blob' })
  })

  const logs = logsData?.data || []
  
  const filteredLogs = logs.filter((l: any) => 
    !search || l.action.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync({ actorType: filterRole !== 'all' ? filterRole.toUpperCase() : undefined })
      toast.success('Activity log exported successfully')
    } catch (err) {
      toast.error('Failed to export activity log')
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            System Activity Log
          </h1>
          <p className="text-body text-mahogany-muted">
            Immutable audit trail of all administrative actions.
          </p>
        </div>
        
        <Button 
          variant="secondary" 
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleExport}
          isLoading={exportMutation.isPending}
        >
          Export Audit Trail
        </Button>
      </header>

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Activity Records</CardTitle>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select
                label=""
                aria-label="Filter by actor"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                options={[
                  { value: 'all', label: 'All Actors' },
                  { value: 'admin', label: 'Admins' },
                  { value: 'operator', label: 'Operators' },
                  { value: 'system', label: 'System' },
                ]}
              />
            </div>
            <div className="flex-1 md:w-64">
              <Input
                label=""
                aria-label="Search logs"
                placeholder="Search action..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {isLoading ? (
              <div className="p-8 text-center text-mahogany-muted font-body">Loading audit trail...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-mahogany-muted font-body">No activity records found.</div>
            ) : (
              filteredLogs.map((log: any) => (
                <LedgerRow
                  key={log.id}
                  title={log.action}
                  subtitle={`Actor: ${log.actorType} • IP: ${log.ipAddress || 'N/A'}`}
                  date={formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  className="px-6 py-3 hover:bg-transparent cursor-default"
                  mono={<span className="text-xs text-mahogany-muted/70">{format(new Date(log.createdAt), 'HH:mm:ss')}</span>}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
