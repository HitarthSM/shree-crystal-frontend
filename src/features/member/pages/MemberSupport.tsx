import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Badge } from '@/components/ui/Badge'
import { Select, Textarea, Input } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'
import { QueryChatThread } from '@/components/ui/QueryChatThread'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { MessageSquare, PlusCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDistanceToNow } from 'date-fns'
import { toast } from '@/components/ui/Toast'
import type { SupportQuery } from '@/types/query'

export function MemberSupport() {
  const [filterStatus, setFilterStatus] = useState<string>('OPEN')
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const queryClient = useQueryClient()

  const { data: queriesData, isLoading } = useQuery<SupportQuery[]>({
    queryKey: ['memberQueries'],
    queryFn: () => apiClient.get('/queries/me').then(r => r.data)
  })
  
  const allQueries: SupportQuery[] = queriesData || []
  const queries = allQueries.filter((q) => filterStatus === 'ALL' || q.status === filterStatus)

  const { data: selectedQuery, isLoading: isLoadingQuery } = useQuery<SupportQuery>({
    queryKey: ['memberQuery', selectedQueryId],
    queryFn: () => apiClient.get(`/queries/${selectedQueryId}`).then(res => res.data),
    enabled: !!selectedQueryId,
  })

  const replyMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      apiClient.post(`/queries/${id}/messages`, { message }).then(res => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['memberQuery', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['memberQueries'] })
      toast.success('Message sent successfully')
    },
    onError: () => {
      toast.error('Failed to send message')
    }
  })

  const handleSendReply = async (message: string) => {
    if (!selectedQueryId) return
    await replyMutation.mutateAsync({ id: selectedQueryId, message })
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="Help & Member Inquiries"
        description="Ask questions or send requests directly to the society office."
      />

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
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Ask a New Question
              </Button>
              <div className="flex flex-row items-center justify-between">
                <CardTitle>My Questions</CardTitle>
                <div className="w-36">
                  <Select
                    label=""
                    aria-label="Filter my questions"
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
                  <div className="p-4 space-y-2">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>
                ) : queries.length === 0 ? (
                  <div className="p-8 text-center text-mahogany-muted font-body">No questions found.</div>
                ) : (
                  queries.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => {
                        setIsCreatingNew(false)
                        setSelectedQueryId(q.id)
                      }}
                      className={`w-full text-left transition-colors focus-visible:outline-none focus-visible:bg-warm-gold/5 cursor-pointer ${
                        selectedQueryId === q.id ? 'bg-warm-gold/10' : 'hover:bg-warm-gold/5'
                      }`}
                    >
                      <LedgerRow
                        title={q.subject}
                        subtitle={q.updatedAt ? formatDistanceToNow(new Date(q.updatedAt), { addSuffix: true }) : ''}
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
        <div className={`flex-1 md:flex-[1.5] ${!selectedQueryId && !isCreatingNew ? 'hidden md:block' : 'block'}`}>
          {isCreatingNew ? (
            <NewTicketForm
              onCancel={() => setIsCreatingNew(false)}
              onSuccess={(id) => {
                setIsCreatingNew(false)
                setSelectedQueryId(id)
              }}
            />
          ) : selectedQueryId ? (
            isLoadingQuery || !selectedQuery ? (
              <Card className="h-[700px] flex items-center justify-center">
                <div className="text-mahogany-muted font-body">Loading inquiry details...</div>
              </Card>
            ) : (
              <QueryChatThread
                query={selectedQuery}
                currentUserRole="MEMBER"
                onClose={() => setSelectedQueryId(null)}
                onSendReply={handleSendReply}
                isSending={replyMutation.isPending}
              />
            )
          ) : (
            <Card padding="lg" className="h-[700px] flex items-center justify-center border-dashed">
              <div className="text-center space-y-3">
                <MessageSquare className="h-12 w-12 text-mahogany-muted/30 mx-auto" />
                <p className="text-mahogany-muted font-body">Select a question from the left or ask a new one.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function NewTicketForm({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void
  onSuccess: (id: string) => void
}) {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [message, setMessage] = useState('')
  const qc = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (payload: { subject: string; category: string; message: string }) =>
      apiClient.post('/queries', payload).then((r) => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['memberQueries'] })
      toast.success('Your question has been sent to the society office.')
      onSuccess(data.id)
    },
    onError: () => {
      toast.error('Failed to submit question. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both the subject and your message.')
      return
    }
    createMutation.mutate({ subject: subject.trim(), category, message: message.trim() })
  }

  return (
    <Card padding="lg" className="h-[700px] flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <CardHeader className="p-0 border-b border-ledger-rule pb-4">
            <CardTitle>Ask a New Question</CardTitle>
            <p className="text-sm font-body text-mahogany-muted mt-1">
              Send your inquiry to the office. You will receive a response within 24 hours.
            </p>
          </CardHeader>
          <Input
            label="Subject"
            placeholder="e.g. Inquiry regarding loan interest"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <Select
            label="Topic Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'GENERAL', label: 'General Society Matters' },
              { value: 'LOAN', label: 'Loan & EMI Inquiries' },
              { value: 'SAVINGS', label: 'Savings & Passbook' },
              { value: 'TECHNICAL', label: 'Website / Login Help' },
            ]}
          />
          <Textarea
            label="Your Message"
            placeholder="Describe your question or request clearly..."
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-ledger-rule">
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={createMutation.isPending}>
            Submit Question
          </Button>
        </div>
      </form>
    </Card>
  )
}
