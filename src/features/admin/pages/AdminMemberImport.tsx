import { useState, useRef } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Upload, CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/Toast'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/api/client'

export function AdminMemberImport() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [batchState, setBatchState] = useState<any>(null)
  
  const importMembers = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiClient.post('/members/import', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data)
    }
  })
  
  const confirmImport = useMutation({
    mutationFn: (batchId: string) => apiClient.post(`/members/import/${batchId}/confirm`).then(res => res.data)
  })

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await importMembers.mutateAsync(file)
      setBatchState(response)
      setStep(2)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload file.')
    }
  }

  const handleConfirm = async () => {
    if (!batchState?.id) return
    try {
      await confirmImport.mutateAsync(batchState.id)
      toast.success(`${batchState.validRows} members imported successfully.`)
      navigate('/admin/members')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to confirm import.')
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide-up max-w-4xl">
      <header className="flex flex-col gap-4">
        <Link 
          to="/admin/members"
          className="inline-flex items-center gap-2 text-sm font-body text-mahogany-muted hover:text-dark-mahogany transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Bulk Import Members
          </h1>
          <p className="text-body text-mahogany-muted">
            Upload a master CSV to add multiple members at once.
          </p>
        </div>
      </header>

      {/* Stepper */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-dark-mahogany' : 'text-mahogany-muted'}`}>
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-warm-gold text-white' : 'bg-ledger-rule'}`}>1</div>
          <span className="font-body text-sm font-medium">Upload CSV</span>
        </div>
        <div className="h-px bg-ledger-rule flex-1 max-w-[40px]" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-dark-mahogany' : 'text-mahogany-muted'}`}>
          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-warm-gold text-white' : 'bg-ledger-rule'}`}>2</div>
          <span className="font-body text-sm font-medium">Preview & Confirm</span>
        </div>
      </div>

      {step === 1 && (
        <Card padding="lg" className="border-dashed border-2 border-ledger-rule bg-white/40">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="h-16 w-16 rounded-full bg-deep-saffron/10 flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-8 w-8 text-deep-saffron" />
            </div>
            <h3 className="font-display text-xl text-dark-mahogany mb-2">Select CSV File</h3>
            <p className="text-sm font-body text-mahogany-muted max-w-md mb-8">
              Ensure your CSV matches the required template format (Name, Mobile, DOB, Address, PAN, Aadhaar).
            </p>
            <div className="flex gap-4">
              <Button variant="secondary" leftIcon={<DownloadIcon className="h-4 w-4" />}>
                Download Template
              </Button>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                ref={fileInputRef}
                onChange={handleUpload}
              />
              <Button 
                variant="primary" 
                onClick={triggerFileInput}
                isLoading={importMembers.isPending}
                leftIcon={<Upload className="h-4 w-4" />}
              >
                Upload File
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && confirmImport.isPending && (
        <Card padding="xl" className="border-warm-gold/30 bg-warm-gold/5 flex flex-col items-center justify-center text-center animate-pulse py-16">
           <div className="h-16 w-16 rounded-full border-4 border-warm-gold/20 border-t-warm-gold animate-spin mb-6" />
           <h3 className="font-display text-xl text-dark-mahogany mb-2">Importing Members...</h3>
           <p className="text-sm font-body text-mahogany-muted max-w-md mx-auto">
             Please do not close this window. We are securely processing {batchState?.validRowCount || 0} records into the database. This may take a few moments.
           </p>
        </Card>
      )}

      {step === 2 && !confirmImport.isPending && (
        <div className="space-y-6 animate-fade-slide-up">
          <Card padding="md" className="border-verdant-green/30 bg-verdant-green/5">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-verdant-green mt-1" />
              <div>
                <h3 className="font-display text-lg text-dark-mahogany mb-1">File Validated Successfully</h3>
                <p className="text-sm font-body text-mahogany-muted mb-4">
                  We found {batchState?.validRowCount || 0} valid records and {batchState?.invalidRowCount || 0} errors in your uploaded file. Please confirm to proceed with the import.
                </p>
                <div className="flex gap-4">
                  <Badge variant="published">{batchState?.validRowCount || 0} Valid rows</Badge>
                  <Badge variant="urgent" className={batchState?.invalidRowCount === 0 ? "opacity-50" : ""}>{batchState?.invalidRowCount || 0} Errors</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card padding="md" className="border-warm-gold/30 bg-warm-gold/5">
             <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-warm-gold mt-1" />
              <div>
                <h3 className="font-display text-lg text-dark-mahogany mb-1">Review Required</h3>
                <p className="text-sm font-body text-mahogany-muted mb-2">
                  Once imported, members will receive an automated welcome SMS containing their Member ID and temporary password.
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="ghost" onClick={() => setStep(1)} disabled={confirmImport.isPending}>
              Cancel Upload
            </Button>
            <Button 
              variant="primary" 
              onClick={handleConfirm}
              isLoading={confirmImport.isPending}
              disabled={!batchState?.validRowCount || batchState.validRowCount === 0}
            >
              Confirm Import {batchState?.validRowCount || 0} Members
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}

function DownloadIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  )
}
