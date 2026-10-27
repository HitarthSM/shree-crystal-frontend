import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Layouts
import { PublicLayout } from './components/layout/PublicLayout'
import { MemberLayout } from './components/layout/MemberLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ChangePasswordPage } from './features/auth/pages/ChangePasswordPage'
import { RequireAuth } from './components/layout/RequireAuth'

// Pages - Public & Auth
import { LandingPage } from './features/public/pages/LandingPage'

import { PublicNoticesPage } from './features/public/pages/PublicNoticesPage'
import { LoginPage } from './features/auth/pages/LoginPage'
import { AboutPage } from './features/public/pages/AboutPage'
import { ContactPage } from './features/public/pages/ContactPage'
import { PrivacyPage } from './features/public/pages/PrivacyPage'
import { TermsPage } from './features/public/pages/TermsPage'

// Pages - Member
import { MemberDashboardPage } from './features/member/pages/MemberDashboardPage'
import { MemberStatementsPage } from './features/member/pages/MemberStatementsPage'
import { MemberNoticesPage } from './features/member/pages/MemberNoticesPage'
import { MemberProfilePage } from './features/member/pages/MemberProfilePage'
import { MemberSupportPage } from './features/member/pages/MemberSupportPage'

// Pages - Admin
import { AdminDashboardPage } from './features/admin/pages/AdminDashboardPage'
import { AdminMembersPage } from './features/admin/pages/AdminMembersPage'
import { AdminMemberDetailPage } from './features/admin/pages/AdminMemberDetailPage'
import { AdminMemberAddPage } from './features/admin/pages/AdminMemberAddPage'
import { AdminMemberImportPage } from './features/admin/pages/AdminMemberImportPage'
import { AdminStatementsPage } from './features/admin/pages/AdminStatementsPage'
import { AdminNoticesPage } from './features/admin/pages/AdminNoticesPage'
import { AdminAuditLogPage } from './features/admin/pages/AdminAuditLogPage'
import { AdminSettingsPage } from './features/admin/pages/AdminSettingsPage'
import { AdminWebsiteContentPage } from './features/admin/pages/AdminWebsiteContentPage'
import { AdminSupportTicketsPage } from './features/admin/pages/AdminSupportTicketsPage'
import { AdminExportPage } from './features/admin/pages/AdminExportPage'
import { AdminBackupPage } from './features/admin/pages/AdminBackupPage'

const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'notices', element: <PublicNoticesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
    ],
  },
  
  // Forced password change (reachable while isFirstLogin is set)
  {
    path: '/change-password',
    element: <RequireAuth allowFirstLogin />,
    children: [{ index: true, element: <ChangePasswordPage /> }],
  },

  // Member Routes
  {
    path: '/dashboard',
    element: <RequireAuth allowedRoles={['member', 'admin', 'super_admin', 'operator', 'viewer']} />,
    children: [
      {
        element: <MemberLayout />,
        children: [
          { index: true, element: <MemberDashboardPage /> },
          { path: 'statements', element: <MemberStatementsPage /> },
          { path: 'notices', element: <MemberNoticesPage /> },
          { path: 'profile', element: <MemberProfilePage /> },
          { path: 'support', element: <MemberSupportPage /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: <RequireAuth allowedRoles={['admin', 'super_admin', 'operator', 'viewer']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'members', element: <AdminMembersPage /> },
          { path: 'members/add', element: <AdminMemberAddPage /> },
          { path: 'members/import', element: <AdminMemberImportPage /> },
          { path: 'members/:id', element: <AdminMemberDetailPage /> },
          { path: 'statements', element: <AdminStatementsPage /> },
          { path: 'notices', element: <AdminNoticesPage /> },
          { path: 'website-content', element: <AdminWebsiteContentPage /> },
          { path: 'support-tickets', element: <AdminSupportTicketsPage /> },
          { path: 'audit-log', element: <AdminAuditLogPage /> },
          { path: 'settings', element: <AdminSettingsPage /> },
          { path: 'export', element: <AdminExportPage /> },
          { path: 'backup', element: <AdminBackupPage /> },
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
