import apiClient from './client'
import { useAuthStore } from '@/store/auth.store'

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  login: async (identifier: string, password: string) => {
    const response = await apiClient.post<TokenPair & { isFirstLogin: boolean }>('/auth/login', {
      identifier,
      password,
    })
    return response.data
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data // User profile
  },

  /** Returns a fresh token pair: changing the password invalidates every other session. */
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post<TokenPair & { message: string }>(
      '/auth/change-password',
      { currentPassword, newPassword },
    )
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },
}

/** Ends the server session (best effort) and always clears local auth state. */
export async function signOut(): Promise<void> {
  try {
    await authApi.logout()
  } catch {
    // Token may already be expired/invalidated — local sign-out must still succeed.
  }
  useAuthStore.getState().clearUser()
}
