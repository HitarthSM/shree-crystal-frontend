export type MemberStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Member {
  id: string;
  memberId: string;
  fullName: string;
  fatherOrHusbandName?: string | null;
  dob: string; // ISO Date string
  gender: Gender;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  email?: string | null;
  photoUrl?: string | null;
  nomineeName?: string | null;
  nomineeRelation?: string | null;
  nomineeContact?: string | null;
  membershipDate: string; // ISO Date string
  shareCapital: string; // Decimal returned as string
  status: MemberStatus;
  createdAt: string;
  updatedAt: string;
  panEncrypted?: string | null;
  aadhaarEncrypted?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateMemberPayload {
  fullName: string;
  fatherOrHusbandName?: string;
  dob: string;
  gender: Gender;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  email?: string;
  aadhaar: string;
  pan?: string;
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeContact?: string;
  shareCapital?: string;
}

