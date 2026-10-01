import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'member' | 'admin' | 'super_admin' | 'operator' | 'viewer'

export interface AuthUser {
  id: string
  memberId: string
  name: string
  mobile: string
  email?: string
  role: UserRole
  /** True while the account still has the society-issued initial password. */
  isFirstLogin?: boolean
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthUser) => void
  setToken: (token: string) => void
  setTokens: (token: string, refreshToken?: string | null) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false, // Changed to false by default since persist rehydrates it

      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      setToken: (token) => set({ token }),

      setTokens: (token, refreshToken) =>
        set((state) => ({ token, refreshToken: refreshToken ?? state.refreshToken })),

      clearUser: () =>
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
)
