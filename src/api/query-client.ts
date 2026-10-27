import { QueryClient } from '@tanstack/react-query'

export const WEB_QUERY_CACHE_KEY = 'SHREE_CRYSTAL_WEB_QUERY_CACHE'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes fresh
      gcTime: 24 * 60 * 60 * 1000, // 24 hours garbage collection retention
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

/** Drops everything fetched for the current user, in memory and in localStorage. */
export function clearUserData(): void {
  queryClient.clear()
  try {
    window.localStorage.removeItem(WEB_QUERY_CACHE_KEY)
  } catch {
    // Ignore storage clear failure
  }
}
