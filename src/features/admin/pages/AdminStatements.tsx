import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LedgerRow } from '@/components/ui/LedgerRow'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select, Input } from '@/components/ui/FormControls'
import { Upload, Filter, CheckCircle2 } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'

export function AdminStatements() {
  const [filter, setFilter] = useState('all')
  const [period, setPeriod] = useState('')
  const [category, setCategory] = useState('Savings')
  const [step, setStep] = useState<1 | 2>(1)
  const [batchState, setBatchState] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const queryClient = useQueryClient()
  const { data: batchesData, isLoading } = useQuery({
    queryKey: ['batches', filter],
    queryFn: () => apiClient.get('/statements/batches', { params: filter !== 'all' ? { status: filter.toUpperCase() } : undefined }).then(res => res.data)
  })
  const batches = batchesData?.data || []

  const uploadBatch = useMutation({
    mutationFn: ({ period, category, file }: any) => {
      const formData = new FormData()
      formData.append('period', period)
      formData.append('category', category)
      formData.append('files', file)
      return apiClient.post('/statements/batch', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data)
    }
  })
  const publishBatch = useMutation({
    mutationFn: (batchId: string) => apiClient.post(`/statements/batch/${batchId}/publish`).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['batches'] })
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !period || !category) {
      toast.error('Please fill period and category before selecting a file.')
      return
    }

    try {
      const response = await uploadBatch.mutateAsync({ period, category, file })
      setBatchState(response)
      setStep(2)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload batch.')
    }
  }

  const handlePublish = async () => {
    if (!batchState?.batchId) return
    try {
      await publishBatch.mutateAsync(batchState.batchId)
      toast.success('Batch published successfully.')
      setStep(1)
      setBatchState(null)
      setPeriod('')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to publish batch.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Statements Management
          </h1>
          <p className="text-body text-mahogany-muted">
            Upload and publish monthly member statements.
          </p>
        </div>
      </header>

      {/* Upload Zone */}
      <Card padding="lg" className="border-2 border-ledger-rule bg-white">
        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-display text-lg text-dark-mahogany">Batch Details</h3>
              <Input 
                label="Period (e.g. Feb 2025)" 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)} 
                placeholder="Feb 2025" 
              />
              <Select 
                label="Category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                options={[{value: 'Savings', label: 'Savings'}, {value: 'Loan', label: 'Loan'}]} 
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center border-dashed border-2 border-ledger-rule bg-white/40 rounded-[6px] p-8">
              <div className="h-12 w-12 rounded-full bg-deep-saffron/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-deep-saffron" />
              </div>
              <h3 className="font-display text-lg text-dark-mahogany mb-2">Upload Statement PDFs</h3>
              <p className="text-sm font-body text-mahogany-muted max-w-sm mb-6">
                Upload the statement files. The system will match them to active members.
              </p>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <Button 
                variant="secondary" 
                onClick={() => fileInputRef.current?.click()}
                isLoading={uploadBatch.isPending}
                disabled={!period || !category}
              >
                Select File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 border border-verdant-green/30 bg-verdant-green/5 rounded-[6px]">
              <CheckCircle2 className="h-6 w-6 text-verdant-green mt-1" />
              <div>
                <h3 className="font-display text-lg text-dark-mahogany mb-1">Batch Validated</h3>
                <p className="text-sm font-body text-mahogany-muted mb-4">
                  Ready to publish statements for {period} ({category}).
                </p>
                <div className="flex gap-4">
                  <Badge variant="published">{batchState?.matchedCount || 0} Matched</Badge>
                  <Badge variant="urgent" className={batchState?.unmatchedList?.length === 0 ? "opacity-50" : ""}>
                    {batchState?.unmatchedList?.length || 0} Unmatched
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setStep(1)} disabled={publishBatch.isPending}>Cancel</Button>
              <Button variant="primary" onClick={handlePublish} isLoading={publishBatch.isPending}>
                Publish {batchState?.matchedCount || 0} Statements
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* History */}
      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle>Batch History</CardTitle>
          <div className="flex items-center gap-3">
            <Select
              label=""
              aria-label="Filter batches"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Batches' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Drafts' },
              ]}
              className="w-40"
            />
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="divide-y divide-ledger-rule">
            {isLoading ? (
              <div className="p-8 text-center text-mahogany-muted font-body">Loading history...</div>
            ) : batches.length === 0 ? (
              <div className="p-8 text-center text-mahogany-muted font-body">No batch history found.</div>
            ) : (
              batches.map((batch: any) => (
                <LedgerRow
                  key={batch.id}
                  stamped={batch.status === 'PUBLISHED'}
                  title={`Statement Batch: ${batch.period} (${batch.category})`}
                  subtitle={`Contains ${batch.matchedCount} member statements`}
                  date={new Date(batch.createdAt).toLocaleDateString()}
                  className="px-6 py-4"
                  badge={<Badge variant={batch.status === 'PUBLISHED' ? 'published' : 'pending'}>{batch.status}</Badge>}
                  mono={
                    <span className="font-data text-sm text-dark-mahogany">{batch.id.substring(0, 8)}...</span>
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
