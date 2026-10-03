export type StatementStatus = 'PENDING' | 'PUBLISHED' | 'WITHDRAWN';
export type StatementCategory = 'Savings' | 'Loan';

export interface StatementItem {
  id: string;
  period: string;
  category: StatementCategory;
  closingBalance?: number;
  status: StatementStatus;
  createdAt: string;
  memberId?: string;
  member?: {
    id: string;
    memberId: string;
    fullName: string;
  };
}

export interface StatementBatch {
  id: string;
  batchId?: string;
  period: string;
  category: StatementCategory;
  status: StatementStatus;
  totalRecords?: number;
  validRowCount?: number;
  uploadedCount?: number;
  createdAt: string;
  publishedAt?: string;
}
