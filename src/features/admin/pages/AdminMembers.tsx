import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { SearchInput } from '@/components/ui/SearchInput'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from '@/components/ui/Table'
import { SkeletonTable } from '@/components/ui/Skeleton'
import { UserPlus, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { formatDate } from '@/lib/utils'
import type { Member } from '@/types/member'

export function AdminMembers() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, isError } = useQuery<{ items?: Member[]; data?: Member[] } | Member[]>({
    queryKey: ['members', { search: searchTerm }],
    queryFn: () => apiClient.get('/members', { params: { search: searchTerm } }).then(res => res.data)
  })

  const filteredMembers: Member[] = Array.isArray(data)
    ? data
    : data?.items || data?.data || []

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="Members Directory"
        description="Manage member accounts, KYC, and access."
        actions={
          <div className="flex gap-3">
            <LinkButton
              to="/admin/members/import"
              variant="secondary"
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Import CSV
            </LinkButton>
            <LinkButton
              to="/admin/members/add"
              variant="gold"
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              Add Member
            </LinkButton>
          </div>
        }
      />

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Member List</CardTitle>
          <div className="w-full md:w-72">
            <SearchInput
              placeholder="Search ID, name, or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <SkeletonTable rows={6} />
          ) : isError ? (
            <div className="p-8 text-center text-deep-crimson font-body">
              Error loading members. Please try again.
            </div>
          ) : filteredMembers.length > 0 ? (
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell className="pl-6">Member ID</TableHeaderCell>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Mobile</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Joined Date</TableHeaderCell>
                  <TableHeaderCell className="pr-6"><span className="sr-only">Actions</span></TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="pl-6 font-data font-medium">{member.memberId}</TableCell>
                    <TableCell className="font-medium">{member.fullName}</TableCell>
                    <TableCell className="font-data text-mahogany-muted">{member.mobile}</TableCell>
                    <TableCell>
                      <Badge variant={member.status}>{member.status}</Badge>
                    </TableCell>
                    <TableCell className="font-data text-mahogany-muted">
                      {member.membershipDate ? formatDate(member.membershipDate) : '—'}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Link 
                        to={`/admin/members/${member.id}`}
                        className="text-sm font-medium text-warm-gold opacity-80 group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm inline-flex items-center gap-1"
                      >
                        View Details →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              title="No members found"
              description={searchTerm ? `No members match "${searchTerm}".` : 'No registered members in the directory yet.'}
              icon="file"
              className="m-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
