export interface PendingApproval {
  id: string;
  actionType: string;
  entityType?: string;
  entityId?: string;
  payload?: Record<string, unknown>;
  requestedBy?: {
    id: string;
    fullName?: string;
    email?: string;
  };
  createdAt: string;
}

export interface AdminDashboardData {
  stats: {
    totalActiveMembers: number;
    pendingApprovalsCount: number;
    totalLoanDisbursed: number;
    activeDeposits: number;
  };
  pendingApprovals: PendingApproval[];
  recentActivity: {
    id: string;
    action: string;
    createdAt: string;
    actorType: string;
  }[];
}

export interface DashboardNoticeItem {
  id: string;
  title?: string;
  body?: string;
  content?: string;
  category?: string;
  priority?: string;
  createdAt?: string;
  publishedAt?: string;
  notice?: {
    id: string;
    title: string;
    body?: string;
    content?: string;
    category?: string;
    priority?: string;
    createdAt?: string;
    publishedAt?: string;
  };
}

export interface MemberDashboardData {
  latestLoan?: {
    id: string;
    type?: string;
    outstandingPrincipal?: number;
    emiAmount?: number;
    nextEmiDate?: string;
  };
  latestStatement?: {
    id: string;
    period?: string;
    category?: string;
    status?: string;
  };
  recentNotices?: DashboardNoticeItem[];
  openQueryCount: number;
}

