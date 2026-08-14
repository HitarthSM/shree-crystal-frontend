import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Select, Textarea, Input } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { Send, CheckCircle2, MessageSquare, X, PlusCircle, RefreshCw } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDistanceToNow, format } from 'date-fns'
import { toast } from '@/components/ui/Toast'

export function MemberSupport() {
  const [filterStatus, setFilterStatus] = useState<string>('OPEN')
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  const { data: queriesData, isLoading } = useQuery({ queryKey: ['memberQueries'], queryFn: () => apiClient.get('/queries/me').then(r => r.data) })
  const queries = (queriesData || []).filter((q: any) => filterStatus === 'ALL' || q.status === filterStatus)

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Support Queries
          </h1>
          <p className="text-body text-mahogany-muted">
            Raise tickets and chat directly with society administrators.
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left List */}
        <div className={`flex-1 ${selectedQueryId || isCreatingNew ? 'hidden md:block' : 'block'}`}>
          <Card padding="none" className="h-[700px] flex flex-col">
            <CardHeader className="p-4 border-b border-ledger-rule flex flex-col gap-4 shrink-0">
              <Button 
                variant="primary" 
                className="w-full justify-center gap-2"
                onClick={() => {
                  setSelectedQueryId(null)
                  setIsCreatingNew(true)
                }}
              >
                <PlusCircle className="h-4 w-4" />
                Raise New Ticket
              </Button>
              <div className="flex flex-row items-center justify-between">
                <CardTitle>My Tickets</CardTitle>
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
                      onClick={() => {
                        setIsCreatingNew(false)
                        setSelectedQueryId(q.id)
                      }}
                      className={`w-full text-left transition-colors focus-visible:outline-none focus-visible:bg-warm-gold/5 ${
                        selectedQueryId === q.id ? 'bg-warm-gold/10' : 'hover:bg-warm-gold/5'
                      }`}
                    >
                      <LedgerRow
                        title={q.subject}
                        subtitle={formatDistanceToNow(new Date(q.updatedAt), { addSuffix: true })}
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
        <div className={`flex-1 md:flex-[1.5] ${!selectedQueryId && !isCreatingNew ? 'hidden md:block' : 'block'}`}>
          {isCreatingNew ? (
            <NewTicketForm onCancel={() => setIsCreatingNew(false)} onSuccess={(id) => {
              setIsCreatingNew(false)
              setSelectedQueryId(id)
            }} />
          ) : selectedQueryId ? (
            <QueryDetail queryId={selectedQueryId} onClose={() => setSelectedQueryId(null)} />
          ) : (
            <Card padding="lg" className="h-[700px] flex items-center justify-center border-dashed">
              <div className="text-center space-y-3">
                <MessageSquare className="h-12 w-12 text-mahogany-muted/30 mx-auto" />
                <p className="text-mahogany-muted font-body">Select a ticket from the left or raise a new one.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function NewTicketForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: (id: string) => void }) {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [message, setMessage] = useState('')
  const qc = useQueryClient()
  const createMutation = useMutation({
    mutationFn: (d: any) => apiClient.post('/queries', d).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memberQueries'] })
  })

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const res = await createMutation.mutateAsync({
        subject,
        category,
        initialMessage: message,
      })
      toast.success('Ticket created successfully')
      onSuccess(res.id)
    } catch (err) {
      toast.error('Failed to create ticket')
    }
  }

  return (
    <Card padding="none" className="h-[700px] flex flex-col relative animate-fade-in bg-white">
      <CardHeader className="p-4 border-b border-ledger-rule flex flex-row items-center justify-between shrink-0 bg-ledger-paper rounded-t-[6px]">
        <CardTitle className="text-lg">Raise New Ticket</CardTitle>
        <button onClick={onCancel} className="p-1 text-mahogany-muted hover:text-dark-mahogany">
          <X className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
        <div>
          <Select 
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'GENERAL', label: 'General Inquiry' },
              { value: 'LOAN', label: 'Loan Related' },
              { value: 'ACCOUNT', label: 'Account / Statement' },
              { value: 'TECHNICAL', label: 'Technical Support' }
            ]}
          />
        </div>
        <div>
          <Input 
            label="Subject"
            placeholder="Brief summary of your issue..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div>
          <Textarea 
            label="Message"
            placeholder="Please describe your issue in detail..."
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            isLoading={createMutation.isPending}
            disabled={!subject.trim() || !message.trim()}
          >
            Submit Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function QueryDetail({ queryId, onClose }: { queryId: string, onClose: () => void }) {
  const qc = useQueryClient()
  const { data: query, isLoading } = useQuery({
    queryKey: ['memberQuery', queryId],
    queryFn: () => apiClient.get(`/queries/me/${queryId}`).then(r => r.data),
    enabled: !!queryId
  })
  const replyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.post(`/queries/me/${id}/reply`, data).then(r => r.data),
    onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: ['memberQuery', v.id] }); qc.invalidateQueries({ queryKey: ['memberQueries'] }) }
  })
  const reopenMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/queries/me/${id}/reopen`).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['memberQuery', queryId] }); qc.invalidateQueries({ queryKey: ['memberQueries'] }) }
  })
  const [replyText, setReplyText] = useState('')

  const handleReply = async () => {
    if (!replyText.trim()) return

    try {
      await replyMutation.mutateAsync({
        id: queryId,
        data: { message: replyText }
      })
      toast.success('Reply sent successfully')
      setReplyText('')
    } catch (err) {
      toast.error('Failed to send reply')
    }
  }

  const handleReopen = async () => {
    try {
      await reopenMutation.mutateAsync(queryId)
      toast.success('Ticket reopened successfully')
    } catch (err) {
      toast.error('Failed to reopen ticket')
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
            Ticket #{query.id.substring(0, 8)} • Created {format(new Date(query.createdAt), 'dd MMM yyyy')}
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
          const isMe = msg.senderType === 'MEMBER'
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-dark-mahogany">
                  {isMe ? 'Me' : 'Administrator'}
                </span>
                <span className="text-[10px] text-mahogany-muted">
                  {format(new Date(msg.createdAt), 'dd MMM HH:mm')}
                </span>
              </div>
              <div 
                className={`max-w-[85%] rounded-lg p-3 text-sm font-body shadow-sm ${
                  isMe 
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
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="bg-verdant-green/10 text-verdant-green text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Ticket Resolved
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2 text-xs" 
              leftIcon={<RefreshCw className="h-3 w-3" />}
              onClick={handleReopen}
              isLoading={reopenMutation.isPending}
            >
              Reopen Ticket
            </Button>
          </div>
        )}
      </CardContent>

      {/* Reply Box */}
      {query.status === 'OPEN' && (
        <div className="p-4 border-t border-ledger-rule bg-white shrink-0 rounded-b-[6px]">
          <Textarea 
            label=""
            placeholder="Type your reply here..."
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mb-3"
          />
          <div className="flex justify-end">
            <Button 
              variant="primary"
              leftIcon={<Send className="h-4 w-4" />}
              onClick={handleReply}
              isLoading={replyMutation.isPending}
              disabled={!replyText.trim()}
            >
              Send Reply
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
