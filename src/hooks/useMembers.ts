import { useQuery } from '@tanstack/react-query';
import { membersApi } from '../api/members';
import { MemberStatus } from '../types/member';

interface UseMembersOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: MemberStatus;
}

export function useMembersQuery(options: UseMembersOptions = {}) {
  return useQuery({
    queryKey: ['members', options],
    queryFn: () => membersApi.getMembers(options),
    // Keep previous data while fetching new pages/searches
    placeholderData: (previousData) => previousData,
  });
}
