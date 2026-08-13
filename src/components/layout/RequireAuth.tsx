import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, type UserRole } from '@/store/auth.store'

interface RequireAuthProps {
  allowedRoles?: UserRole[]
}

export function RequireAuth({ allowedRoles }: RequireAuthProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return null // or a full-page loading skeleton
  }

  if (!isAuthenticated || !user) {
    // Redirect to login but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their default home
    const homePath = user.role === 'admin' || user.role === 'operator' ? '/admin' : '/dashboard'
    return <Navigate to={homePath} replace />
  }

  return <Outlet />
}
