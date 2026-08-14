import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Layouts
import { PublicLayout } from './components/layout/PublicLayout'
import { MemberLayout } from './components/layout/MemberLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { RequireAuth } from './components/layout/RequireAuth'

// Pages - Public & Auth
import { LandingPage } from './features/public/pages/LandingPage'
import { LoginPage } from './features/auth/pages/LoginPage'
import { OTPLogin } from './features/auth/pages/OTPLogin'
import { ForgotPassword } from './features/auth/pages/ForgotPassword'

// Pages - Member
import { MemberDashboard } from './features/member/pages/MemberDashboard'
import { MemberStatements } from './features/member/pages/MemberStatements'
import { MemberNotices } from './features/member/pages/MemberNotices'
import { MemberProfile } from './features/member/pages/MemberProfile'
import { MemberSupport } from './features/member/pages/MemberSupport'

// Pages - Admin
import { AdminDashboard } from './features/admin/pages/AdminDashboard'
import { AdminMembers } from './features/admin/pages/AdminMembers'
import { AdminMemberDetail } from './features/admin/pages/AdminMemberDetail'
import { AdminMemberAdd } from './features/admin/pages/AdminMemberAdd'
import { AdminMemberImport } from './features/admin/pages/AdminMemberImport'
import { AdminStatements } from './features/admin/pages/AdminStatements'
import { AdminNotices } from './features/admin/pages/AdminNotices'
import { AdminActivity } from './features/admin/pages/AdminActivity'
import { AdminSettings } from './features/admin/pages/AdminSettings'
import { AdminQueries } from './features/admin/pages/AdminQueries'

// Temporary placeholders until pages are built
const Placeholder = ({ name }: { name: string }) => (
  <div className="p-8"><h1 className="text-display-md font-display">{name}</h1><p>Under construction...</p></div>
)

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'login/otp', element: <OTPLogin /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'about', element: <Placeholder name="About Us" /> },
      { path: 'notices', element: <Placeholder name="Public Notices" /> },
      { path: 'contact', element: <Placeholder name="Contact" /> },
    ],
  },
  
  // Member Routes
  {
    path: '/dashboard',
    element: <RequireAuth allowedRoles={['member', 'admin', 'operator']} />,
    children: [
      {
        element: <MemberLayout />,
        children: [
          { index: true, element: <MemberDashboard /> },
          { path: 'statements', element: <MemberStatements /> },
          { path: 'notices', element: <MemberNotices /> },
          { path: 'profile', element: <MemberProfile /> },
          { path: 'support', element: <MemberSupport /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: <RequireAuth allowedRoles={['admin', 'operator']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'members', element: <AdminMembers /> },
          { path: 'members/add', element: <AdminMemberAdd /> },
          { path: 'members/import', element: <AdminMemberImport /> },
          { path: 'members/:id', element: <AdminMemberDetail /> },
          { path: 'statements', element: <AdminStatements /> },
          { path: 'notices', element: <AdminNotices /> },
          { path: 'support', element: <AdminQueries /> },
          { path: 'activity', element: <AdminActivity /> },
          { path: 'settings', element: <AdminSettings /> },
          { path: 'export', element: <Placeholder name="Export Data" /> },
          { path: 'backup', element: <Placeholder name="Database Backup" /> },
        ],
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
