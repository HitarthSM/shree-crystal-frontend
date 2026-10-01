/// <reference types="vite/client" />
import axios, { type InternalAxiosRequestConfig } from 'axios'

const rawBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const API_BASE = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send httpOnly cookies for auth
  headers: {
    'Content-Type': 'application/json',
  },
})

import { useAuthStore } from '../store/auth.store'

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

let refreshPromise: Promise<string> | null = null

/** Exchanges the stored refresh token for a new pair. Shared so parallel 401s refresh once. */
function refreshAccessToken(): Promise<string> {
  const { refreshToken, setTokens } = useAuthStore.getState()
  if (!refreshToken) return Promise.reject(new Error('No refresh token'))

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
    } catch {
      endSession()
      return Promise.reject(error)
    }
  },
)

export default apiClient
