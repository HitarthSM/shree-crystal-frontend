export type NoticeCategory = 'GENERAL' | 'AGM' | 'CIRCULAR' | 'URGENT';
export type NoticePriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  priority?: NoticePriority;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateNoticePayload {
  title: string;
  body: string;
  category: NoticeCategory;
  priority?: NoticePriority;
}
