export type QueryStatus = 'OPEN' | 'RESOLVED';
export type SenderType = 'MEMBER' | 'ADMIN';

export interface QueryMessage {
  id: string;
  queryId?: string;
  senderType: SenderType;
  message: string;
  createdAt: string;
}

export interface SupportQuery {
  id: string;
  subject: string;
  category?: string;
  status: QueryStatus;
  createdAt: string;
  updatedAt: string;
  memberId?: string;
  member?: {
    id: string;
    memberId: string;
    fullName: string;
    mobile?: string;
  };
  messages?: QueryMessage[];
}
