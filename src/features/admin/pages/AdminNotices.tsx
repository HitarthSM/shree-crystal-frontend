import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select, Input, Textarea } from '@/components/ui/FormControls'
import { PageHeader } from '@/components/ui/PageHeader'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { Plus, Trash2, X, Send } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDate } from '@/lib/utils'
import type { Notice, NoticeCategory } from '@/types/notice'

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

export function AdminNotices() {
  const [isDrafting, setIsDrafting] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState<NoticeCategory>('GENERAL')

  const queryClient = useQueryClient()

  const { data: noticesData, isLoading } = useQuery<{ items?: Notice[]; data?: Notice[] } | Notice[]>({
    queryKey: ['notices'],
    queryFn: () => apiClient.get('/notices').then(res => res.data)
  })
  const notices: Notice[] = Array.isArray(noticesData)
    ? noticesData
    : noticesData?.items || noticesData?.data || []

  const createNotice = useMutation({
    mutationFn: (data: { title: string; body: string; category: NoticeCategory }) =>
      apiClient.post('/notices', data).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notices'] })
  })

  const deleteNotice = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notices/${id}`).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notices'] })
  })

  const handlePublish = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Title and body are required')
      return
    }
    try {
      await createNotice.mutateAsync({ title: title.trim(), body: body.trim(), category })
      toast.success('Notice published and dispatch started')
      setIsDrafting(false)
      setTitle('')
      setBody('')
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse
      toast.error(error.response?.data?.message || 'Failed to publish notice')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotice.mutateAsync(id)
      toast.success('Notice deleted')
    } catch {
      toast.error('Failed to delete notice')
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="Notices & Circulars"
        description="Manage public and member-only announcements."
        actions={
          !isDrafting ? (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsDrafting(true)}
            >
              Draft Notice
            </Button>
          ) : undefined
        }
      />

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
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              options={[
                { value: 'GENERAL', label: 'General Announcement' },
                { value: 'AGM', label: 'Annual General Meeting (AGM)' },
                { value: 'CIRCULAR', label: 'Official Circular' },
                { value: 'URGENT', label: 'Urgent Alert' },
              ]}
            />
            <Textarea
              label="Notice Body"
              placeholder="Write the full notice announcement here..."
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-ledger-rule">
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

      {/* Notices List */}
      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule">
          <CardTitle>Published Notices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {isLoading ? (
              <div className="p-4 space-y-2">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            ) : notices.length === 0 ? (
              <div className="p-8 text-center text-mahogany-muted font-body">No published notices found.</div>
            ) : (
              notices.map((notice) => (
                <LedgerRow
                  key={notice.id}
                  title={notice.title}
                  subtitle={notice.body}
                  date={notice.createdAt ? formatDate(notice.createdAt) : ''}
                  className="px-6 py-4"
                  badge={<Badge variant={notice.category}>{notice.category}</Badge>}
                  mono={
                    <button
                      onClick={() => handleDelete(notice.id)}
                      disabled={deleteNotice.isPending}
                      aria-label="Delete notice"
                      className="p-2 text-mahogany-muted hover:text-deep-crimson hover:bg-deep-crimson/10 rounded-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-crimson"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
