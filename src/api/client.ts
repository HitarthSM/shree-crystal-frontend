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

// Request interceptor — nothing needed: token is httpOnly cookie
apiClient.interceptors.request.use((config) => config)

// Response interceptor — handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local auth state and redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
