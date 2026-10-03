import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/FormControls'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryChatThread } from '@/components/ui/QueryChatThread'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { MessageSquare } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDistanceToNow } from 'date-fns'
import { toast } from '@/components/ui/Toast'
import type { SupportQuery } from '@/types/query'

export function AdminQueries() {
  const [filterStatus, setFilterStatus] = useState<string>('OPEN')
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: queriesData, isLoading } = useQuery<SupportQuery[]>({
    queryKey: ['adminQueries', filterStatus !== 'ALL' ? { status: filterStatus } : undefined],
    queryFn: () => apiClient.get('/queries', { params: filterStatus !== 'ALL' ? { status: filterStatus } : undefined }).then(res => res.data)
  })
  
  const queries: SupportQuery[] = queriesData || []

  const { data: selectedQuery, isLoading: isLoadingQuery } = useQuery<SupportQuery>({
    queryKey: ['adminQuery', selectedQueryId],
    queryFn: () => apiClient.get(`/queries/${selectedQueryId}`).then(res => res.data),
    enabled: !!selectedQueryId,
  })

  const replyMutation = useMutation({
    mutationFn: ({ id, message, status }: { id: string; message: string; status?: string }) => 
      apiClient.post(`/queries/${id}/reply`, { message, status }).then(res => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminQuery', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['adminQueries'] })
      toast.success(variables.status === 'RESOLVED' ? 'Reply sent and ticket resolved!' : 'Reply sent successfully')
    },
    onError: () => {
      toast.error('Failed to send reply')
    }
  })

  const handleSendReply = async (message: string, resolve?: boolean) => {
    if (!selectedQueryId) return
    await replyMutation.mutateAsync({
      id: selectedQueryId,
      message,
      status: resolve ? 'RESOLVED' : undefined,
    })
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="Support Queries"
        description="Manage and respond to member support tickets."
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left List */}
        <div className={`flex-1 ${selectedQueryId ? 'hidden md:block' : 'block'}`}>
          <Card padding="none" className="h-[700px] flex flex-col">
            <CardHeader className="p-4 border-b border-ledger-rule flex flex-row items-center justify-between shrink-0">
              <CardTitle>Active Tickets</CardTitle>
              <div className="w-36">
                <Select
                  label=""
                  aria-label="Filter tickets"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  options={[
                    { value: 'OPEN', label: 'Open' },
                    { value: 'RESOLVED', label: 'Resolved' },
                    { value: 'ALL', label: 'All Status' },
                  ]}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              <div className="divide-y divide-ledger-rule">
                {isLoading ? (
                  <div className="p-4 space-y-2">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>
                ) : queries.length === 0 ? (
                  <div className="p-8 text-center text-mahogany-muted font-body">No tickets found.</div>
                ) : (
                  queries.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQueryId(q.id)}
                      className={`w-full text-left transition-colors focus-visible:outline-none focus-visible:bg-warm-gold/5 cursor-pointer ${
                        selectedQueryId === q.id ? 'bg-warm-gold/10' : 'hover:bg-warm-gold/5'
                      }`}
                    >
                      <LedgerRow
                        title={q.subject}
                        subtitle={`${q.member?.fullName || 'Member'} (${q.member?.memberId || 'SC'})`}
                        date={q.updatedAt ? formatDistanceToNow(new Date(q.updatedAt), { addSuffix: true }) : 'Recent'}
                        className="px-4 py-3"
                        badge={<Badge variant={q.status === 'OPEN' ? 'pending' : 'resolved'}>{q.status}</Badge>}
                      />
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Detail Panel */}
        <div className={`flex-1 md:flex-[1.5] ${!selectedQueryId ? 'hidden md:block' : 'block'}`}>
          {selectedQueryId ? (
            isLoadingQuery || !selectedQuery ? (
              <Card className="h-[700px] flex items-center justify-center">
                <div className="text-mahogany-muted font-body">Loading ticket thread...</div>
              </Card>
            ) : (
              <QueryChatThread
                query={selectedQuery}
                currentUserRole="ADMIN"
                onClose={() => setSelectedQueryId(null)}
                onSendReply={handleSendReply}
                isSending={replyMutation.isPending}
              />
            )
          ) : (
            <Card padding="lg" className="h-[700px] flex items-center justify-center border-dashed">
              <div className="text-center space-y-3">
                <MessageSquare className="h-12 w-12 text-mahogany-muted/30 mx-auto" />
                <p className="text-mahogany-muted font-body">Select a ticket from the left to view details and reply.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
