/// <reference types="vite/client" />
import { clearUserData } from './query-client'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/auth.store'

const rawBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send httpOnly cookies for auth
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — inject token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Endpoints whose 401 means "bad credentials/token", not "access token expired".
const isAuthEndpoint = (url?: string) => !!url && /\/auth\/(login|refresh)$/.test(url)

/** No refresh token is stored: the visitor was never signed in (e.g. public pages). */
class NoSessionError extends Error {}

/** The server refused the refresh token, as opposed to a network/server failure. */
function isRefreshRejected(err: unknown): boolean {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    return status === 400 || status === 401 || status === 403
  }
  return false
}

let refreshPromise: Promise<string> | null = null

/** Exchanges the stored refresh token for a new pair. Shared so parallel 401s refresh once. */
async function refreshAccessToken(): Promise<string> {
  // Another tab may have rotated the refresh token already; pick up what it stored.
  await useAuthStore.persist.rehydrate()
  const { refreshToken, setTokens } = useAuthStore.getState()
  if (!refreshToken) throw new NoSessionError('No refresh token')

  refreshPromise ??= axios
    .post(`${API_BASE}/auth/refresh`, { refreshToken })
    .then((res) => {
      // Plain axios call: unwrap the { success, data } envelope by hand.
      const tokens = (res.data?.data ?? res.data) as { accessToken: string; refreshToken: string }
      setTokens(tokens.accessToken, tokens.refreshToken)
      return tokens.accessToken
    })
    .finally(() => {
      refreshPromise = null
    })

  return refreshPromise
}

function endSession() {
  useAuthStore.getState().clearUser()
  clearUserData()
  window.location.href = '/login'
}

// Response interceptor — unwrap data envelope, refresh on 401
apiClient.interceptors.response.use(
  (res) => {
    // Unwrap the standard backend envelope { success: true, data: T, message: 'OK' }
    if (res.data && res.data.success === true && res.data.data !== undefined) {
      res.data = res.data.data
    }
    return res
  },
  async (error) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true
    try {
      const accessToken = await refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      // Only a server rejection ends the session. Offline or a 5xx must not sign the user out.
      if (refreshError instanceof NoSessionError) {
        useAuthStore.getState().clearUser()
      } else if (isRefreshRejected(refreshError)) {
        endSession()
      }
      return Promise.reject(error)
    }
  },
)

export default apiClient
