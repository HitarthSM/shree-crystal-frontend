export interface ActivityLogItem {
  id: string;
  action: string;
  actorType: 'ADMIN' | 'OPERATOR' | 'SYSTEM' | 'MEMBER';
  actorId?: string;
  actorName?: string;
  details?: string | Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}
