import { useState, useRef, useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stepper } from '@/components/ui/Stepper'
import { SearchInput } from '@/components/ui/SearchInput'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '@/components/ui/Table'
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/Toast'
import { useMutation } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { downloadBlob, cn } from '@/lib/utils'

export interface ImportErrorItem {
  row: number
  memberNo?: string
  fullName?: string
  mobile?: string
  reasons: string[]
}

export interface ImportValidItem {
  memberNo?: string
  fullName?: string
  mobile?: string
  gender?: string
  city?: string
  dob?: string
}

export interface ImportBatchResponse {
  batchId: string
  totalRows?: number
  validRowCount: number
  invalidRowCount: number
  errorList?: ImportErrorItem[]
  previewData?: ImportValidItem[]
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

export function AdminMemberImport() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [batchState, setBatchState] = useState<ImportBatchResponse | null>(null)
  const [isLoadingBatchDetails, setIsLoadingBatchDetails] = useState(false)

  // Error Table & Preview State
  const [activeTab, setActiveTab] = useState<'errors' | 'valid'>('errors')
  const [errorSearch, setErrorSearch] = useState('')
  const [selectedReasonFilter, setSelectedReasonFilter] = useState<string>('ALL')
  const [errorPage, setErrorPage] = useState(1)
  const pageSize = 10

  const importMembers = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiClient
        .post<ImportBatchResponse>('/members/import', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => res.data)
    },
  })

  const confirmImport = useMutation({
    mutationFn: (batchId: string) =>
      apiClient.post(`/members/import/${batchId}/confirm`).then((res) => res.data),
  })

  // If batchState is missing errorList or previewData, fetch details from backend
  useEffect(() => {
    if (step === 2 && batchState?.batchId && !batchState.errorList) {
      setIsLoadingBatchDetails(true)
      apiClient
        .get<ImportBatchResponse>(`/members/import/${batchState.batchId}`)
        .then((res) => {
          setBatchState((prev) => (prev ? { ...prev, ...res.data } : res.data))
        })
        .catch(() => {
          // Ignore if fetching details fails, keep existing state
        })
        .finally(() => {
          setIsLoadingBatchDetails(false)
        })
    }
  }, [step, batchState?.batchId, batchState?.errorList])

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const response = await importMembers.mutateAsync(file)
      setBatchState(response)
      setActiveTab(response.validRowCount === 0 ? 'errors' : 'valid')
      setSelectedReasonFilter('ALL')
      setErrorSearch('')
      setErrorPage(1)
      setStep(2)
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse
      toast.error(error.response?.data?.message || 'Failed to upload file.')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleConfirm = async () => {
    if (!batchState?.batchId) return
    try {
      await confirmImport.mutateAsync(batchState.batchId)
      toast.success(`${batchState.validRowCount} members imported successfully.`)
      navigate('/admin/members')
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse
      toast.error(error.response?.data?.message || 'Failed to confirm import.')
    }
  }

  const handleDownloadTemplate = () => {
    const csvContent = [
      'MEMBER_NO,MEMBER_NAME,MOBILE,AADHAR,BIRTH_DATE,SEX,ADD1,ADD2,DISTNAME',
      'SCC-00001,Rajeshbhai Patel,9825012345,123456789012,1980-05-15,M,12 Shanti Nagar,Near S.T. Stand,Surat',
      'SCC-00002,Meenaben Shah,9825098765,987654321098,1985-11-20,F,45 Swastik Society,Station Road,Ahmedabad',
      'SCC-00003,Kiritbhai Desai,9825045678,234567890123,1976-08-10,M,78 Sardar Patel Colony,Adajan,Surat',
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, 'member_import_template.csv')
    toast.success('Sample member import template downloaded.')
  }

  const handleDownloadErrorReport = () => {
    if (!batchState?.errorList || batchState.errorList.length === 0) {
      toast.error('No error records available to export.')
      return
    }

    const headers = ['Row Number', 'Member ID / No', 'Full Name', 'Validation Errors']
    const rows = batchState.errorList.map((err) => [
      err.row,
      `"${(err.memberNo || '').replace(/"/g, '""')}"`,
      `"${(err.fullName || '').replace(/"/g, '""')}"`,
      `"${err.reasons.join('; ').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    downloadBlob(blob, `member_import_errors_${batchState.batchId}.csv`)
    toast.success('Error report downloaded successfully.')
  }

  // Summary counts of error reasons
  const errorReasonCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    batchState?.errorList?.forEach((err) => {
      err.reasons?.forEach((r) => {
        counts[r] = (counts[r] || 0) + 1
      })
    })
    return counts
  }, [batchState?.errorList])

  // Filtered error list based on search and reason filter
  const filteredErrors = useMemo(() => {
    if (!batchState?.errorList) return []
    return batchState.errorList.filter((err) => {
      const matchesReason =
        selectedReasonFilter === 'ALL' ||
        err.reasons.some((r) => r.toLowerCase().includes(selectedReasonFilter.toLowerCase()))

      const query = errorSearch.trim().toLowerCase()
      const matchesSearch =
        !query ||
        String(err.row).includes(query) ||
        (err.memberNo && err.memberNo.toLowerCase().includes(query)) ||
        (err.fullName && err.fullName.toLowerCase().includes(query)) ||
        err.reasons.some((r) => r.toLowerCase().includes(query))

      return matchesReason && matchesSearch
    })
  }, [batchState?.errorList, selectedReasonFilter, errorSearch])

  const totalErrorPages = Math.ceil(filteredErrors.length / pageSize) || 1
  const paginatedErrors = useMemo(() => {
    const start = (errorPage - 1) * pageSize
    return filteredErrors.slice(start, start + pageSize)
  }, [filteredErrors, errorPage, pageSize])

  const isAllErrors = (batchState?.validRowCount ?? 0) === 0 && (batchState?.invalidRowCount ?? 0) > 0
  const hasMixedResults = (batchState?.validRowCount ?? 0) > 0 && (batchState?.invalidRowCount ?? 0) > 0
  const isAllValid = (batchState?.validRowCount ?? 0) > 0 && (batchState?.invalidRowCount ?? 0) === 0

  return (
    <div className="space-y-8 animate-fade-slide-up max-w-5xl">
      <PageHeader
        backLink={{ to: '/admin/members', label: 'Back to Directory' }}
        title="Bulk Import Members"
        description="Upload a master CSV or Excel file to add or synchronize members."
      />

      <Stepper
        steps={[
          { id: 1, title: 'Upload File', description: 'Select CSV or Excel' },
          { id: 2, title: 'Preview & Confirm', description: 'Validate records' },
        ]}
        currentStep={step}
      />

      {step === 1 && (
        <Card padding="lg" className="border-dashed border-2 border-ledger-rule bg-white/40">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="h-16 w-16 rounded-full bg-deep-saffron/10 flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-8 w-8 text-deep-saffron" />
            </div>
            <h3 className="font-display text-xl text-dark-mahogany mb-2">Select CSV or Excel File</h3>
            <p className="text-sm font-body text-mahogany-muted max-w-md mb-8">
              Ensure your file contains member details matching the required template format (MEMBER_NO, MEMBER_NAME, MOBILE, AADHAR, BIRTH_DATE, SEX, ADDRESS).
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="secondary"
                onClick={handleDownloadTemplate}
                leftIcon={<Download className="h-4 w-4" />}
              >
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
        <Card
          padding="lg"
          className="border-warm-gold/30 bg-warm-gold/5 flex flex-col items-center justify-center text-center animate-pulse py-16"
        >
          <div className="h-16 w-16 rounded-full border-4 border-warm-gold/20 border-t-warm-gold animate-spin mb-6" />
          <h3 className="font-display text-xl text-dark-mahogany mb-2">Importing Members...</h3>
          <p className="text-sm font-body text-mahogany-muted max-w-md mx-auto">
            Please do not close this window. We are securely processing {batchState?.validRowCount || 0} records into the database. This may take a few moments.
          </p>
        </Card>
      )}

      {step === 2 && !confirmImport.isPending && (
        <div className="space-y-6 animate-fade-slide-up">
          {/* Validation Status Card */}
          {isAllErrors && (
            <Card padding="md" className="border-crimson-danger/40 bg-crimson-danger/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-crimson-danger mt-1 shrink-0" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-display text-lg text-crimson-danger font-semibold">
                    Validation Failed: 0 Valid Records
                  </h3>
                  <p className="text-sm font-body text-dark-mahogany/80">
                    All {batchState?.invalidRowCount || 0} rows in your uploaded file encountered validation errors. None could be imported.
                    This typically happens if the records were already imported previously (e.g. mobile or Aadhaar already in the system) or duplicated within the file.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <Badge variant="suspended">0 Valid rows</Badge>
                    <Badge variant="urgent">{batchState?.invalidRowCount || 0} Errors</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {hasMixedResults && (
            <Card padding="md" className="border-warm-gold/40 bg-warm-gold/10">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-warm-gold mt-1 shrink-0" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-display text-lg text-dark-mahogany font-semibold">
                    Validation Completed with Warnings
                  </h3>
                  <p className="text-sm font-body text-dark-mahogany/80">
                    We found {batchState?.validRowCount || 0} valid records ready for import, and {batchState?.invalidRowCount || 0} rows with validation errors.
                    You can inspect the errors below or proceed with importing the valid records.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <Badge variant="published">{batchState?.validRowCount || 0} Valid rows</Badge>
                    <Badge variant="urgent">{batchState?.invalidRowCount || 0} Errors</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {isAllValid && (
            <Card padding="md" className="border-verdant-green/30 bg-verdant-green/5">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="h-6 w-6 text-verdant-green mt-1 shrink-0" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-display text-lg text-dark-mahogany font-semibold">
                    File Validated Successfully
                  </h3>
                  <p className="text-sm font-body text-mahogany-muted">
                    All {batchState?.validRowCount || 0} records passed validation with 0 errors. Please confirm to proceed with the import.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <Badge variant="published">{batchState?.validRowCount || 0} Valid rows</Badge>
                    <Badge variant="resolved">0 Errors</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Tab Selector & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ledger-rule pb-3">
            <div className="flex items-center gap-2">
              {(batchState?.invalidRowCount ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('errors')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-[4px] transition-colors',
                    activeTab === 'errors'
                      ? 'bg-crimson-danger text-white'
                      : 'bg-ivory text-mahogany-muted hover:text-dark-mahogany hover:bg-warm-gold/10'
                  )}
                >
                  Validation Errors ({batchState?.invalidRowCount || 0})
                </button>
              )}

              {(batchState?.validRowCount ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('valid')}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-[4px] transition-colors',
                    activeTab === 'valid'
                      ? 'bg-verdant-green text-white'
                      : 'bg-ivory text-mahogany-muted hover:text-dark-mahogany hover:bg-warm-gold/10'
                  )}
                >
                  Valid Records Preview ({batchState?.validRowCount || 0})
                </button>
              )}
            </div>

            {(batchState?.invalidRowCount ?? 0) > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadErrorReport}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download Error Report (.csv)
              </Button>
            )}
          </div>

          {/* ERRORS TAB */}
          {activeTab === 'errors' && (batchState?.invalidRowCount ?? 0) > 0 && (
            <Card padding="md" className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display text-base text-dark-mahogany font-semibold">
                    Detailed Error Log
                  </h4>
                  <p className="text-xs font-body text-mahogany-muted">
                    Click any filter pill or search by Member ID, Name, or Error reason to inspect specific rows.
                  </p>
                </div>
                <div className="w-full md:w-72">
                  <SearchInput
                    value={errorSearch}
                    onChange={(e) => {
                      setErrorSearch(e.target.value)
                      setErrorPage(1)
                    }}
                    onClear={() => {
                      setErrorSearch('')
                      setErrorPage(1)
                    }}
                    placeholder="Search by ID, name, row..."
                  />
                </div>
              </div>

              {/* Reason Pills Filter */}
              {Object.keys(errorReasonCounts).length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-ledger-rule">
                  <span className="text-xs font-data text-mahogany-muted font-medium mr-1">
                    Filter Reason:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedReasonFilter('ALL')
                      setErrorPage(1)
                    }}
                    className={cn(
                      'px-2.5 py-1 text-xs rounded-full border transition-colors',
                      selectedReasonFilter === 'ALL'
                        ? 'bg-dark-mahogany text-white border-dark-mahogany'
                        : 'bg-white text-mahogany-muted border-ledger-rule hover:border-dark-mahogany'
                    )}
                  >
                    All ({batchState?.invalidRowCount || 0})
                  </button>

                  {Object.entries(errorReasonCounts).map(([reason, count]) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => {
                        setSelectedReasonFilter(reason)
                        setErrorPage(1)
                      }}
                      className={cn(
                        'px-2.5 py-1 text-xs rounded-full border transition-colors flex items-center gap-1.5',
                        selectedReasonFilter === reason
                          ? 'bg-crimson-danger text-white border-crimson-danger'
                          : 'bg-crimson-danger/10 text-crimson-danger border-crimson-danger/20 hover:bg-crimson-danger/20'
                      )}
                    >
                      <span>{reason}</span>
                      <span className="font-mono font-bold bg-white/30 px-1.5 py-0.5 rounded-full text-[10px]">
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Error Table */}
              {isLoadingBatchDetails ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="h-6 w-6 text-warm-gold animate-spin mb-2" />
                  <p className="text-sm font-body text-mahogany-muted">Loading detailed error logs...</p>
                </div>
              ) : filteredErrors.length === 0 ? (
                <div className="py-8 text-center text-sm font-body text-mahogany-muted">
                  No errors match your search or filter.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-[4px] border border-ledger-rule overflow-hidden">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeaderCell className="w-20">Row #</TableHeaderCell>
                          <TableHeaderCell className="w-32">Member No</TableHeaderCell>
                          <TableHeaderCell className="w-64">Member Name</TableHeaderCell>
                          <TableHeaderCell>Identified Validation Error(s)</TableHeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedErrors.map((err, idx) => (
                          <TableRow key={`${err.row}-${idx}`}>
                            <TableCell className="font-mono text-xs text-mahogany-muted">
                              #{err.row}
                            </TableCell>
                            <TableCell className="font-mono font-semibold text-dark-mahogany">
                              {err.memberNo || `Row ${err.row}`}
                            </TableCell>
                            <TableCell className="font-body text-sm font-medium text-dark-mahogany">
                              {err.fullName || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1.5">
                                {err.reasons.map((r, rIdx) => (
                                  <Badge key={rIdx} variant="urgent" className="text-xs font-normal">
                                    {r}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between px-2 pt-2 text-xs font-body text-mahogany-muted">
                    <span>
                      Showing {Math.min((errorPage - 1) * pageSize + 1, filteredErrors.length)} to{' '}
                      {Math.min(errorPage * pageSize, filteredErrors.length)} of {filteredErrors.length}{' '}
                      records
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={errorPage <= 1}
                        onClick={() => setErrorPage((p) => Math.max(p - 1, 1))}
                        leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
                      >
                        Previous
                      </Button>
                      <span className="font-mono text-xs px-2 font-medium">
                        Page {errorPage} of {totalErrorPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={errorPage >= totalErrorPages}
                        onClick={() => setErrorPage((p) => Math.min(p + 1, totalErrorPages))}
                        rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* VALID PREVIEW TAB */}
          {activeTab === 'valid' && (batchState?.validRowCount ?? 0) > 0 && (
            <Card padding="md" className="space-y-4">
              <div>
                <h4 className="font-display text-base text-dark-mahogany font-semibold">
                  Valid Records Preview (First 50 Rows)
                </h4>
                <p className="text-xs font-body text-mahogany-muted">
                  These records have passed format and uniqueness validation and will be committed when confirmed.
                </p>
              </div>

              <div className="rounded-[4px] border border-ledger-rule overflow-hidden">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell className="w-28">Member No</TableHeaderCell>
                      <TableHeaderCell>Full Name</TableHeaderCell>
                      <TableHeaderCell className="w-32">Mobile</TableHeaderCell>
                      <TableHeaderCell className="w-24">Gender</TableHeaderCell>
                      <TableHeaderCell className="w-32">City</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(batchState?.previewData || []).map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono font-semibold text-dark-mahogany">
                          {row.memberNo || `Row ${idx + 1}`}
                        </TableCell>
                        <TableCell className="font-medium text-dark-mahogany">
                          {row.fullName || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-mahogany-muted">
                          {row.mobile || '-'}
                        </TableCell>
                        <TableCell className="text-xs">{row.gender || '-'}</TableCell>
                        <TableCell className="text-xs">{row.city || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}

          {/* Review Required Note */}
          {(batchState?.validRowCount ?? 0) > 0 && (
            <Card padding="md" className="border-warm-gold/30 bg-warm-gold/5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-warm-gold mt-1 shrink-0" />
                <div>
                  <h3 className="font-display text-base text-dark-mahogany font-medium mb-1">
                    Review Required Before Proceeding
                  </h3>
                  <p className="text-sm font-body text-mahogany-muted">
                    Once imported, members will receive an automated welcome SMS containing their Member ID and temporary password.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-ledger-rule">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              disabled={confirmImport.isPending}
            >
              Back to Upload
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={handleConfirm}
                isLoading={confirmImport.isPending}
                disabled={!batchState?.validRowCount || batchState.validRowCount === 0}
              >
                {batchState?.validRowCount && batchState.validRowCount > 0
                  ? `Confirm Import ${batchState.validRowCount} Members`
                  : 'Cannot Import (0 Valid Records)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
