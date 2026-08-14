import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Select, Textarea } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, MessageSquare, X } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDistanceToNow, format } from 'date-fns'
import { toast } from '@/components/ui/Toast'

export function AdminQueries() {
  const [filterStatus, setFilterStatus] = useState<string>('OPEN')
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null)

  const { data: queriesData, isLoading } = useQuery({
    queryKey: ['adminQueries', filterStatus !== 'ALL' ? { status: filterStatus } : undefined],
    queryFn: () => apiClient.get('/queries', { params: filterStatus !== 'ALL' ? { status: filterStatus } : undefined }).then(res => res.data)
  })
  
  const queries = queriesData || []

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Support Queries
          </h1>
          <p className="text-body text-mahogany-muted">
            Manage and respond to member support tickets.
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left List */}
        <div className={`flex-1 ${selectedQueryId ? 'hidden md:block' : 'block'}`}>
          <Card padding="none" className="h-[700px] flex flex-col">
            <CardHeader className="p-4 border-b border-ledger-rule flex flex-row items-center justify-between shrink-0">
              <CardTitle>Active Tickets</CardTitle>
              <div className="w-32">
                <Select
                  label=""
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
                  <div className="p-8 text-center text-mahogany-muted font-body">Loading tickets...</div>
                ) : queries.length === 0 ? (
                  <div className="p-8 text-center text-mahogany-muted font-body">No tickets found.</div>
                ) : (
                  queries.map((q: any) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQueryId(q.id)}
                      className={`w-full text-left transition-colors focus-visible:outline-none focus-visible:bg-warm-gold/5 ${
                        selectedQueryId === q.id ? 'bg-warm-gold/10' : 'hover:bg-warm-gold/5'
                      }`}
                    >
                      <LedgerRow
                        title={q.subject}
                        subtitle={`${q.member?.fullName} (${q.member?.memberId})`}
                        date={formatDistanceToNow(new Date(q.updatedAt), { addSuffix: true })}
                        className="px-4 py-3"
                        badge={<Badge variant={q.status === 'OPEN' ? 'pending' : 'active'}>{q.status}</Badge>}
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
            <QueryDetail queryId={selectedQueryId} onClose={() => setSelectedQueryId(null)} />
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

function QueryDetail({ queryId, onClose }: { queryId: string, onClose: () => void }) {
  const queryClient = useQueryClient()
  const { data: query, isLoading } = useQuery({
    queryKey: ['adminQuery', queryId],
    queryFn: () => apiClient.get(`/queries/${queryId}`).then(res => res.data),
    enabled: !!queryId
  })
  const replyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.post(`/queries/${id}/reply`, data).then(res => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminQuery', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['adminQueries'] })
    }
  })
  const [replyText, setReplyText] = useState('')

  const handleReply = async (resolve: boolean = false) => {
    if (!replyText.trim()) return

    try {
      await replyMutation.mutateAsync({
        id: queryId,
        data: {
          message: replyText,
          status: resolve ? 'RESOLVED' : undefined
        }
      })
      toast.success(resolve ? 'Reply sent and ticket resolved!' : 'Reply sent successfully')
      setReplyText('')
    } catch (err) {
      toast.error('Failed to send reply')
    }
  }

  if (isLoading) {
    return <Card className="h-[700px] flex items-center justify-center"><div className="text-mahogany-muted">Loading thread...</div></Card>
  }

  if (!query) {
    return <Card className="h-[700px] flex items-center justify-center"><div className="text-deep-crimson">Query not found.</div></Card>
  }

  return (
    <Card padding="none" className="h-[700px] flex flex-col relative animate-fade-in">
      {/* Header */}
      <CardHeader className="p-4 border-b border-ledger-rule flex flex-row items-start justify-between shrink-0 bg-ledger-paper rounded-t-[6px]">
        <div>
          <CardTitle className="text-lg leading-tight mb-1">{query.subject}</CardTitle>
          <p className="text-sm text-mahogany-muted">
            Raised by {query.member?.fullName} ({query.member?.memberId}) on {format(new Date(query.createdAt), 'dd MMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={query.status === 'OPEN' ? 'pending' : 'active'}>{query.status}</Badge>
          <button onClick={onClose} className="p-1 text-mahogany-muted hover:text-dark-mahogany md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-6 overflow-y-auto flex-1 space-y-6 bg-white/50">
        {query.messages?.map((msg: any) => {
          const isAdmin = msg.senderType === 'ADMIN'
          return (
            <div key={msg.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-dark-mahogany">
                  {isAdmin ? 'Administrator' : query.member?.fullName}
                </span>
                <span className="text-[10px] text-mahogany-muted">
                  {format(new Date(msg.createdAt), 'dd MMM HH:mm')}
                </span>
              </div>
              <div 
                className={`max-w-[85%] rounded-lg p-3 text-sm font-body shadow-sm ${
                  isAdmin 
                    ? 'bg-dark-mahogany text-ledger-paper rounded-tr-none' 
                    : 'bg-ledger-paper border border-ledger-rule text-dark-mahogany rounded-tl-none'
                }`}
              >
                {msg.message}
              </div>
            </div>
          )
        })}
        {query.status === 'RESOLVED' && (
          <div className="flex items-center justify-center py-4">
            <div className="bg-verdant-green/10 text-verdant-green text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Ticket Resolved
            </div>
          </div>
        )}
      </CardContent>

      {/* Reply Box */}
      {query.status === 'OPEN' && (
        <div className="p-4 border-t border-ledger-rule bg-white shrink-0 rounded-b-[6px]">
          <Textarea 
            label=""
            placeholder="Type your reply to the member here..."
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mb-3"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-mahogany-muted font-body">Press Send & Resolve if this concludes the issue.</p>
            <div className="flex gap-2">
              <Button 
                variant="ghost"
                onClick={() => handleReply(false)}
                disabled={!replyText.trim() || replyMutation.isPending}
              >
                Send Reply
              </Button>
              <Button 
                variant="primary"
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                onClick={() => handleReply(true)}
                isLoading={replyMutation.isPending}
                disabled={!replyText.trim()}
              >
                Send & Resolve
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
