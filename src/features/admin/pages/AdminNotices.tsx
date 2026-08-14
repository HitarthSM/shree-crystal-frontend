
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select, Input, Textarea } from '@/components/ui/FormControls'
import { Plus, Trash2, X, Send } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

export function AdminNotices() {
  const [isDrafting, setIsDrafting] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('GENERAL')

  const queryClient = useQueryClient()

  const { data: noticesData, isLoading } = useQuery({
    queryKey: ['notices'],
    queryFn: () => apiClient.get('/notices').then(res => res.data)
  })
  const notices = noticesData?.data || []

  const createNotice = useMutation({
    mutationFn: (data: any) => apiClient.post('/notices', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notices'] })
  })
  const deleteNotice = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notices/${id}`).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notices'] })
  })

  const handlePublish = async () => {
    if (!title || !body) {
      toast.error('Title and body are required')
      return
    }
    try {
      await createNotice.mutateAsync({ title, body, category })
      toast.success('Notice published and dispatch started')
      setIsDrafting(false)
      setTitle('')
      setBody('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish notice')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotice.mutateAsync(id)
      toast.success('Notice deleted')
    } catch (err: any) {
      toast.error('Failed to delete notice')
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Notices & Circulars
          </h1>
          <p className="text-body text-mahogany-muted">
            Manage public and member-only announcements.
          </p>
        </div>
        
        {!isDrafting && (
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsDrafting(true)}>
            Draft Notice
          </Button>
        )}
      </header>

      {isDrafting && (
        <Card padding="lg" className="border-2 border-verdant-green bg-white shadow-lg animate-fade-in">
          <CardHeader className="mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-dark-mahogany">Compose Notice</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsDrafting(false)}>
              <X className="h-5 w-5 text-mahogany-muted" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              label="Notice Title" 
              placeholder="E.g. Annual General Meeting" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <Select 
              label="Category" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'GENERAL', label: 'General' },
                { value: 'URGENT', label: 'Urgent' },
                { value: 'AGM', label: 'AGM' },
              ]}
            />
            <Textarea 
              label="Message Body" 
              placeholder="Type the announcement here..."
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end gap-4 pt-2">
              <Button variant="ghost" onClick={() => setIsDrafting(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                leftIcon={<Send className="h-4 w-4" />}
                onClick={handlePublish}
                isLoading={createNotice.isPending}
              >
                Publish & Dispatch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule">
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {isLoading ? (
              <div className="p-8 text-center text-mahogany-muted font-body">Loading notices...</div>
            ) : notices.length === 0 ? (
              <div className="p-8 text-center text-mahogany-muted font-body">No active notices found.</div>
            ) : (
              notices.map((notice: any) => (
                <LedgerRow
                  key={notice.id}
                  stamped={true}
                  title={notice.title}
                  subtitle={`Target: All Members`}
                  date={new Date(notice.createdAt).toLocaleDateString()}
                  className="px-6 py-4"
                  badge={
                    <div className="flex gap-2">
                      <Badge variant={notice.category.toLowerCase() as any}>{notice.category}</Badge>
                    </div>
                  }
                  mono={
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(notice.id)}
                        disabled={deleteNotice.isPending}
                        className="p-1.5 text-mahogany-muted hover:text-deep-crimson transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
