# Frontend QA Checklist (Polish Phase)

Audit of empty, loading, and error states across all screens as mandated by Section 15 of the playbook.

## Phase 2: Auth & Public
- [x] **Landing Page**
  - Uses Skeleton while fetching EMI rates.
  - Handles API errors gracefully in the EMI calculator.
- [x] **Login Flow**
  - Inputs show inline validation errors immediately.
  - Buttons show loading spinner on submit.

## Phase 3: Member Screens
- [x] **Member Dashboard**
  - Uses Skeleton loader matching the layout on initial fetch.
  - `EmptyState` used if no recent notices are available.
- [x] **My Statements**
  - Displays `EmptyState` when the filter returns no results.
  - Download buttons show local loading states, not page-level spinners.
- [x] **Notices**
  - Handles empty list state beautifully with an `EmptyState` component.
- [x] **Profile**
  - Uses Skeleton loaders.
  - Masks sensitive data (Aadhaar/PAN) consistently.

## Phase 4: Admin Screens
- [x] **Admin Dashboard**
  - Shows "All caught up" inline state when Pending Approvals queue is 0.
- [x] **Admin Members List**
  - Displays `EmptyState` if a search query yields 0 results.
- [x] **Admin Member Detail**
  - Handles edge cases where a member has 0 active loans or 0 uploaded statements.
- [x] **Admin Statement Upload**
  - Upload zone disables and shows spinner while processing CSV.
- [x] **Admin Activity Log**
  - Displays `EmptyState` if filter combination yields 0 logs.

## Global Infrastructure
- [x] **Error Boundary**
  - `ErrorBoundary.tsx` implemented in `main.tsx`. Catches uncaught runtime errors and displays a branded Heritage Saffron fallback UI instead of crashing to white.
- [x] **Toast Notifications**
  - Success/Error Toasts used consistently across all mutation actions (Login, Upload CSV, Save Member).
