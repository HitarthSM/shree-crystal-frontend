import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/FormControls'
import { PageHeader } from '@/components/ui/PageHeader'
import { Download, FileText, Users, Database } from 'lucide-react'
import { toast } from '@/components/ui/Toast'
import apiClient from '@/api/client'
import { downloadBlob } from '@/lib/utils'
import type { Member } from '@/types/member'
import type { StatementItem } from '@/types/statement'

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

export function AdminExport() {
  const [exportType, setExportType] = useState<'members' | 'statements' | 'audit'>('members')
  const [format, setFormat] = useState<'csv' | 'json'>('csv')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (exportType === 'audit') {
        const response = await apiClient.get('/activity-log/export', { responseType: 'blob' })
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        downloadBlob(blob, `audit_logs_${new Date().toISOString().slice(0, 10)}.xlsx`)
      } else if (exportType === 'members') {
        const res = await apiClient.get('/members', { params: { limit: 1000 } })
        const items: Member[] = res.data?.data || (Array.isArray(res.data) ? res.data : [])
        if (format === 'json') {
          const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
          downloadBlob(blob, `members_export_${new Date().toISOString().slice(0, 10)}.json`)
        } else {
          const headers = ['Member No', 'Full Name', 'Mobile', 'Status', 'Date of Joining', 'Address']
          const rows = items.map((m) => [
            m.memberId || '',
            `"${(m.fullName || '').replace(/"/g, '""')}"`,
            m.mobile || '',
            m.status || '',
            m.membershipDate ? new Date(m.membershipDate).toLocaleDateString() : '',
            `"${(m.addressLine1 || '').replace(/"/g, '""')}"`
          ].join(','))
          const csv = [headers.join(','), ...rows].join('\n')
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          downloadBlob(blob, `members_directory_${new Date().toISOString().slice(0, 10)}.csv`)
        }
      } else if (exportType === 'statements') {
        const res = await apiClient.get('/statements/admin', { params: { limit: 1000 } })
        const items: StatementItem[] = res.data?.data || (Array.isArray(res.data) ? res.data : [])
        if (format === 'json') {
          const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' })
          downloadBlob(blob, `statements_export_${new Date().toISOString().slice(0, 10)}.json`)
        } else {
          const headers = ['Period', 'Member ID', 'Category', 'Closing Balance', 'Status']
          const rows = items.map((s) => [
            s.period || '',
            s.member?.memberId || s.memberId || '',
            s.category || '',
            s.closingBalance || 0,
            s.status || ''
          ].join(','))
          const csv = [headers.join(','), ...rows].join('\n')
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          downloadBlob(blob, `statements_export_${new Date().toISOString().slice(0, 10)}.csv`)
        }
      }
      toast.success(`${exportType.charAt(0).toUpperCase() + exportType.slice(1)} data exported successfully`)
    } catch (err: unknown) {
      const error = err as AxiosErrorResponse
      toast.error(error.response?.data?.message || 'Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="Export Data"
        description="Generate and download reports for members, statements, and system audits."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="lg" className="md:col-span-2">
          <CardHeader className="mb-6">
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Dataset"
                value={exportType}
                onChange={(e) => setExportType(e.target.value as 'members' | 'statements' | 'audit')}
                options={[
                  { value: 'members', label: 'Member Directory & KYC' },
                  { value: 'statements', label: 'Financial Statements' },
                  { value: 'audit', label: 'System Audit Logs' },
                ]}
              />
              <Select
                label="File Format"
                value={format}
                onChange={(e) => setFormat(e.target.value as 'csv' | 'json')}
                options={[
                  { value: 'csv', label: 'CSV / Excel Spreadsheet' },
                  { value: 'json', label: 'JSON Data Format' },
                ]}
                disabled={exportType === 'audit'}
                hint={exportType === 'audit' ? 'Audit logs export natively as XLSX' : undefined}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-ledger-rule">
              <Button
                variant="primary"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleExport}
                isLoading={isExporting}
              >
                Export & Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card padding="md" className="bg-ivory border-ledger-rule space-y-4">
          <h4 className="font-display text-lg text-dark-mahogany font-semibold">Report Information</h4>
          <p className="text-sm font-body text-mahogany-muted">
            All exported datasets are compiled in real-time directly from the encrypted database.
          </p>
          <div className="space-y-2 pt-2 text-xs font-body text-mahogany-muted">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-warm-gold" />
              <span>Full member registry with KYC status</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-warm-gold" />
              <span>Monthly account & passbook summaries</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-warm-gold" />
              <span>Immutable administrative activity log</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
