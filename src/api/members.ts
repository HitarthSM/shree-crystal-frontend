import apiClient from './client';
import { Member, PaginatedResponse, MemberStatus } from '../types/member';

interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: MemberStatus;
}

export const membersApi = {
  getMembers: async (params: GetMembersParams): Promise<PaginatedResponse<Member>> => {
    const response = await apiClient.get('/members', { params });
    return response.data;
  },

  getMemberById: async (id: string): Promise<Member> => {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  }
};
