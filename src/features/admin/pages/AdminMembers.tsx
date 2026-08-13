import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { UserPlus, Upload, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMembersQuery } from '@/hooks/useMembers'

export function AdminMembers() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading, isError } = useMembersQuery({ search: searchTerm })
  const filteredMembers = data?.data || []

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md font-display text-dark-mahogany mb-1">
            Members Directory
          </h1>
          <p className="text-body text-mahogany-muted">
            Manage member accounts, KYC, and access.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            to="/admin/members/import" 
            className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-[4px] transition-all duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 border border-dark-mahogany text-dark-mahogany hover:bg-dark-mahogany/5 active:bg-dark-mahogany/10 h-10 px-4 py-2 text-sm"
          >
            <Upload className="h-4 w-4" /> Import CSV
          </Link>
          <Link 
            to="/admin/members/add" 
            className="inline-flex items-center justify-center gap-2 font-body font-medium rounded-[4px] transition-all duration-[120ms] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold focus-visible:ring-offset-2 bg-warm-gold text-white hover:bg-warm-gold-hover h-10 px-4 py-2 text-sm"
          >
            <UserPlus className="h-4 w-4" /> Add Member
          </Link>
        </div>
      </header>

      <Card padding="none">
        <CardHeader className="p-6 pb-4 border-b border-ledger-rule flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Member List</CardTitle>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mahogany-muted" />
              <input
                type="text"
                placeholder="Search ID, name, or mobile..."
                className="w-full h-10 pl-9 pr-4 rounded-[4px] border border-ledger-rule bg-white text-sm font-body focus:outline-none focus:ring-2 focus:ring-warm-gold focus:border-warm-gold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" aria-label="Filter members">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-mahogany-muted">Loading members...</div>
          ) : isError ? (
            <div className="p-8 text-center text-deep-crimson">Error loading members. Please try again.</div>
          ) : filteredMembers.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-ivory border-b border-ledger-rule">
                  <th className="font-data text-xs font-semibold text-mahogany-muted uppercase tracking-wider p-4 pl-6">Member ID</th>
                  <th className="font-data text-xs font-semibold text-mahogany-muted uppercase tracking-wider p-4">Name</th>
                  <th className="font-data text-xs font-semibold text-mahogany-muted uppercase tracking-wider p-4">Mobile</th>
                  <th className="font-data text-xs font-semibold text-mahogany-muted uppercase tracking-wider p-4">Status</th>
                  <th className="font-data text-xs font-semibold text-mahogany-muted uppercase tracking-wider p-4">Joined Date</th>
                  <th className="p-4 pr-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ledger-rule">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-warm-gold/5 transition-colors group">
                    <td className="p-4 pl-6 font-data text-sm font-medium text-dark-mahogany">{member.memberId}</td>
                    <td className="p-4 font-body text-sm text-dark-mahogany">{member.fullName}</td>
                    <td className="p-4 font-data text-sm text-mahogany-muted">{member.mobile}</td>
                    <td className="p-4">
                      <Badge variant={member.status.toLowerCase() as any}>{member.status.toUpperCase()}</Badge>
                    </td>
                    <td className="p-4 font-data text-sm text-mahogany-muted">
                      {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(member.membershipDate))}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link 
                        to={`/admin/members/${member.id}`}
                        className="text-sm font-medium text-warm-gold opacity-0 group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded-sm focus-visible:opacity-100"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="No members found"
              description="No members match your current search term."
              icon="file"
              className="m-6"
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
