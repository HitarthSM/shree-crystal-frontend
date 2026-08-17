/// <reference types="vite/client" />
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

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

// Response interceptor — handle 401 globally and unwrap data envelope
apiClient.interceptors.response.use(
  (res) => {
    // Unwrap the standard backend envelope { success: true, data: T, message: 'OK' }
    if (res.data && res.data.success === true && res.data.data !== undefined) {
      res.data = res.data.data
    }
    return res
  },
  (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && originalRequest.url !== '/auth/login') {
      // Clear local auth state and redirect to login
      useAuthStore.getState().clearUser()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
