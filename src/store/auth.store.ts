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
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: AuthUser) => void
  setToken: (token: string) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false, // Changed to false by default since persist rehydrates it

      setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),

      setToken: (token) => set({ token }),

      clearUser: () => set({ user: null, token: null, isAuthenticated: false, isLoading: false }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
)
