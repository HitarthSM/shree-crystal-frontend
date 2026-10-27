export type TicketStatus = 'OPEN' | 'RESOLVED';
export type SenderType = 'MEMBER' | 'ADMIN';

export interface SupportTicketMessage {
  id: string;
  ticketId?: string;
  senderType: SenderType;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  memberId?: string;
  member?: {
    id: string;
    membershipNumber: string;
    fullName: string;
    mobileNumber?: string;
  };
  messages?: SupportTicketMessage[];
}
