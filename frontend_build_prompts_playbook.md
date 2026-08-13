# Frontend Build Prompt Playbook
**Shree Crystal Co-op Credit and Consumers Society Limited**

Same approach as the backend playbook — one self-contained prompt per section, in build order. Every prompt assumes `frontend_design_system.md` exists in the repo and references its tokens by name. Work through these in order; don't jump to a feature screen before the shell (routing, layouts, base components) it depends on exists.

---

## Section 0 — Project Bootstrap

```
Set up a new React + TypeScript frontend with Vite.

1. Initialize with Vite's react-ts template.
2. Install: tailwindcss, react-router-dom, @tanstack/react-query, zustand,
   react-hook-form, zod, @hookform/resolvers, axios, lucide-react,
   class-variance-authority, clsx, tailwind-merge.
3. Set up TailwindCSS using the config from frontend_design_system.md Section
   10 — colors, font families, and border radius tokens exactly as specified.
4. Install the three font families via @fontsource (Zilla Slab, IBM Plex Sans,
   IBM Plex Mono) — self-hosted, not a Google Fonts CDN link. Import weights:
   Zilla Slab 600/700, Plex Sans 400/500, Plex Mono 400/500.
5. Set up the folder structure from frontend_best_practices_guide.md Section 2
   (api/, features/, components/ui/, components/layout/, routes/, lib/).
6. Set up ESLint + Prettier, consistent with the backend's config style.
7. Add a .env.example with VITE_API_URL, and confirm .env is gitignored.
8. Add a base index.css applying the type scale from the design system
   (Section 2) as CSS custom properties or Tailwind utility classes.

Deliverable: `npm run dev` shows a blank page styled with the ledger-paper
background and Plex Sans loaded (verify in devtools that the font actually
loaded, not a fallback).
```

---

## Section 1 — Design System Implementation (base components)

```
Build the components/ui/ primitives that every other screen will use. Follow
frontend_design_system.md exactly — don't improvise colors or spacing outside
the token system.

Build:
- Button (variants: primary [brass fill], secondary [navy outline], ghost,
  destructive [stamp-red]; sizes: sm/md/lg; loading state shows inline
  spinner + disables itself per Section 7 of the design system)
- Input, Textarea, Select (visible labels always, never placeholder-as-label;
  error state shows stamp-red border + message below, per Section 7)
- Card (1px border + subtle single-direction shadow per Section 4, not a
  glossy floating shadow)
- LedgerRow — the signature component from Section 3: thin bottom rule,
  right-aligned Plex Mono columns for amount/date, optional brass stamp-mark
  icon slot for confirmed/published/resolved states
- StampMark — the brass circular mark itself, as a standalone component
  accepting an `animate` prop that triggers the drop-and-settle animation
  from Section 6 (respect prefers-reduced-motion — fall back to instant
  appearance)
- Badge (status pills: active=banyan-green, suspended=stamp-red,
  pending=brass, using text+color together, never color alone)
- Skeleton — ledger-row-shaped loading placeholder (thin rule + shimmering
  mono-column blocks), not a generic spinner
- Toast (success/error/info variants, for mutation feedback)
- EmptyState (icon + message + optional action button — for "no statements
  yet," "no notices," etc.)

Every component must have visible keyboard focus (2px brass ring, 2px offset)
and meet the touch-target minimum (44x44px) on interactive elements.

Deliverable: a simple /dev/components route (dev-only, not linked in nav)
rendering every component in every state/variant, so you can visually QA the
whole design system in one place before building real screens.
```

---

## Section 2 — Routing & Layout Shell

```
Build the app shell: routing, layouts, and auth guards.

1. src/routes/AppRouter.tsx — top-level route tree with three branches:
   public routes, member routes (wrapped in RequireAuth + RequireRole
   "member"), admin routes (wrapped in RequireAuth + RequireRole "admin").
2. RequireAuth — checks Zustand auth store for a valid session; redirects to
   /login if missing, preserving the intended destination to redirect back
   to after login.
3. RequireRole — checks role against the route; redirects to a proper "Not
   authorized" page (styled, on-brand) if the role doesn't match — never a
   blank screen or silent failure.
4. Three layouts:
   - PublicLayout — ink-navy header with society name in Zilla Slab, nav,
     ledger-paper content area, navy footer.
   - MemberLayout — simplified nav (mobile-first: bottom tab bar on small
     screens, top nav on desktop), ledger-paper content area.
   - AdminLayout — ink-navy sidebar nav (collapsible on tablet), ledger-paper
     content area, breadcrumbs.
5. Wire React Query's QueryClientProvider and Zustand store providers at the
   app root.

Deliverable: navigating to any placeholder route shows the correct layout
shell with real header/nav/footer styled per the design system, even before
any real screen content exists.
```

---

## Section 3 — Auth Screens

```
Build features/auth/ — Login, OTP verify, Forgot password.

1. LoginPage — Member ID/mobile + password fields (React Hook Form + Zod,
   mirroring the backend's login DTO validation), primary brass Button,
   ink-navy hero panel with society name on desktop (split-screen layout),
   simplified single-column on mobile.
2. OtpVerifyPage — 6-digit OTP input (auto-advance between digit boxes),
   countdown timer for resend, clear error state on wrong/expired OTP.
3. ForgotPasswordPage — request OTP, then a ResetPasswordPage step to set a
   new password against the policy (min 8 chars, mixed case, number) with
   inline validation feedback as the user types, not just on submit.
4. useAuth hook + auth.store.ts (Zustand) — holds current user, role, token
   (in-memory only, per the security section of the best-practices guide —
   never localStorage).
5. Wire these to the real /auth/* endpoints via the API client.

Deliverable: a full login → OTP → redirect to the correct dashboard (member
or admin, based on role) flow working end-to-end against the real backend.
```

---

## Section 4 — Public Landing Page

```
Build the public landing page — this is the one screen where the ink-navy
hero treatment leads.

1. Hero section: ink-navy background, Zilla Slab headline (society name +
   one-line mission statement), brief supporting copy, primary CTA
   ("Member Login"). Keep it restrained — this is a credit society, not a
   product launch page; avoid stock finance-app imagery clichés (handshakes,
   generic growth charts).
2. About section: registration number, registered address, brief history —
   on ledger-paper background.
3. Notices preview: latest 2-3 public notices rendered as LedgerRow
   components — this is the first real use of the signature component,
   ties the public site visually to the member experience they'll see after
   login.
4. Interest/loan calculator widget — amount + tenure inputs, live-calculated
   EMI display in Plex Mono (data typography, since it's a number), reads
   current rates from the public /loan-config endpoint. Include a visible
   disclaimer per the Terms of Use: "Indicative estimate only, not a loan
   offer."
5. Contact/footer: registered office, grievance contact, links to Privacy
   Policy / Terms of Use / Grievance Policy pages (render the markdown
   content from legal_policy_drafts.md as real pages once the society has
   finalized them).

Deliverable: a complete, responsive public landing page, mobile-first,
loading real data for notices and loan rates (not hardcoded placeholders).
```

---

## Section 5 — Member Dashboard

```
Build features/dashboard/MemberDashboard.tsx, consuming the single
GET /members/me/dashboard aggregation endpoint from the backend spec.

Layout (mobile-first, matches the wireframe from earlier planning):
- Header: member name, "Member since [date]"
- Summary cards row: balance/share summary, latest statement, recent
  notices count — using the Card component, brass accents sparingly on
  numbers
- Quick links: Statements, Notices, Calculator, Update profile — as a
  simple row of Badge-style link chips
- Recent notices: 2-3 LedgerRow entries
- Loading state: Skeleton components in the same layout shape, not a
  full-page spinner
- Empty states: if no statements/notices exist yet, use EmptyState with a
  clear, friendly message

Deliverable: dashboard loads real aggregated data via one React Query hook
(useMemberDashboard), renders correctly in loading/error/success/empty
states.
```

---

## Section 6 — Member Statements

```
Build features/statements/member/ — the list and detail view.

1. StatementsListPage — paginated list of the member's own statements as
   LedgerRow components (period, category, right-aligned in Plex Mono),
   filter by year/period.
2. Each row links to view/download the PDF — download action shows a brief
   loading state on the button itself, not a page-level spinner.
3. Empty state if no statements published yet.
4. This screen is the best place to visually confirm the ledger-row pattern
   feels right at real scale (many rows) — if it feels cramped or
   monotonous with 20+ rows, revisit spacing before moving on, don't just
   push through.

Deliverable: real pagination working against the backend's paginated
endpoint (not fetching everything and paginating client-side).
```

---

## Section 7 — Member Notices

```
Build features/notices/member/NoticesListPage.tsx.

1. List of notices relevant to the member (general + targeted), as
   LedgerRow-style entries but with a category Badge (General/AGM/
   Circular/Urgent — Urgent uses stamp-red, others use neutral/brass
   variants).
2. Click to expand/view full notice + attachment.
3. Mark-as-read updates on view (fire the PATCH silently, don't require an
   explicit "mark as read" button click for the common case).
4. Filter by category.

Deliverable: notices render correctly across all four categories with
visually distinct but consistent badge styling.
```

---

## Section 8 — Member Profile

```
Build features/members/member/ProfilePage.tsx.

1. Read-only display of profile fields, Aadhaar/PAN shown masked (never
   fetch or render unmasked values here, per the security section of the
   best-practices guide).
2. "Request Edit" flow for sensitive fields (name, address, Aadhaar, PAN,
   nominee) — opens a form, submits a MemberChangeRequest, shows a pending
   badge on that field until admin resolves it.
3. Directly editable: password change, notification preference (SMS/email
   toggle) — no approval flow needed for these.
4. Change request history — simple list showing past requests and their
   status (pending/approved/rejected).

Deliverable: the distinction between "direct edit" and "request edit" fields
is visually and functionally clear — a member should never be confused about
which fields need approval.
```

---

## Section 9 — Admin Dashboard

```
Build features/dashboard/AdminDashboard.tsx.

Same aggregation pattern as the member dashboard, but admin-scoped data:
total active members, statements uploaded this month, pending approvals
(maker-checker queue if enabled), last backup status, recent activity feed
(last 10-15 entries as compact LedgerRow entries).

Quick action buttons prominent at the top: Add member, Import members,
Upload statements, Post a notice — these are the four most common admin
actions per the original module spec, don't bury them in a menu.

Deliverable: dashboard reflects the admin's actual role (Operator sees
action buttons, Viewer sees data only, per the RBAC spec).
```

---

## Section 10 — Admin Members

```
Build features/members/admin/ — list, add, and import screens.

1. MembersListPage — table (not LedgerRow list — this needs sortable
   columns: Member ID, Name, Mobile, Status badge, Join date), search bar,
   status filter, row click navigates to detail.
2. AddMemberForm — full field set from the spec, React Hook Form + Zod
   validation mirroring the backend DTO (mobile format, Aadhaar format, age
   18+). Aadhaar/PAN inputs mask on blur.
3. ImportMembersPage — three-step flow matching the backend workflow exactly:
   (a) file upload, (b) validation preview showing valid/error row counts
   with a downloadable error report, (c) confirm import. Don't let the
   admin skip the preview step even for a small file — the UI shouldn't
   offer a "skip preview" shortcut.
4. Bulk actions on the list (send notice to selected, export selected).

Deliverable: the import flow's preview step is impossible to bypass in the
UI, matching the backend's validate-before-commit workflow.
```

---

## Section 11 — Admin Member Profile Detail

```
Build features/members/admin/MemberDetailPage.tsx.

Tabbed or sectioned view: Profile (full KYC, edit with reason-required for
sensitive fields), Statements (this member's uploads), Loan (if any),
Activity (log entries for this member), Change Requests (pending ones need
visible approve/reject actions right here, not just in a separate global
queue).

Suspend/Reactivate action requires a reason (modal with a required text
field) before confirming — never a single-click status change on a real
member record.

Deliverable: editing a sensitive field (Aadhaar, PAN, name, DOB) visibly
requires the reason field before the save button enables — this should be
impossible to submit without it, not just validated after the fact.
```

---

## Section 12 — Admin Statements

```
Build features/statements/admin/ — batch upload and management.

1. Batch upload: drag-and-drop or file picker, shows the match preview
   (matched/unmatched counts, unmatched files listed with reasons) before
   any publish action is available — the Publish button should be disabled
   until the admin has actually seen the preview.
2. Publish confirmation shows exactly how many members will be notified.
3. Statement library: searchable/filterable list across all members
   (admin-only view), with Replace/Withdraw actions requiring a reason.

Deliverable: it's visually impossible to publish a batch without seeing the
match preview first — the UI enforces the same sequence as the backend
workflow.
```

---

## Section 13 — Admin Notices

```
Build features/notices/admin/ — create and manage.

1. Create form: title, body (rich text optional — if added later, must be
   sanitized before render per the security section), category, audience
   selector (all/specific member/group), channel checkboxes (website/SMS/
   email), publish now vs schedule for later (date/time picker).
2. Notices list with status (Draft/Scheduled/Published/Expired), edit action
   shows the "already sent via SMS to N members" warning when applicable
   (matching the backend workflow's warning behavior).

Deliverable: scheduling a notice for a future date visibly shows it as
"Scheduled" with the target time, and it's clear in the UI that nothing
happens until that time arrives.
```

---

## Section 14 — Admin Activity Log

```
Build features/activity-log/AdminActivityLogPage.tsx.

Filterable table (user, action type, date range), each row shows actor,
action, affected record, timestamp — dense, data-forward, uses Plex Mono
for timestamps/IDs. Export button triggers the backend export endpoint and
downloads the result.

No edit or delete affordance anywhere on this screen, even visually — don't
build a UI for an action the backend won't allow.

Deliverable: filtering and export both work against real backend data,
and pagination handles a genuinely large log without loading everything at
once.
```

---

## Section 15 — Polish Pass: Empty, Loading, and Error States

```
This section doesn't add screens — it closes gaps across everything built so
far, the same way the backend playbook had a cross-cutting test section.

Audit every screen from Sections 4-14 and confirm each one has:
1. A real Skeleton loading state matching that screen's actual layout, not
   a generic spinner.
2. A real EmptyState with a specific, friendly message (not "No data").
3. A real error state (React Query's isError) with a plain-language message
   and a retry action, never a raw error object rendered to the page.
4. Toast feedback on every mutation (add member, upload statement, publish
   notice, etc.) — success and failure both, using the interface's own
   voice per the design system's writing guidance (active voice, no
   apologizing, specific about what happened).

Deliverable: a checklist file (FRONTEND_QA_CHECKLIST.md) listing every
screen with these four items ticked off, so gaps are visible rather than
assumed fixed.
```

---

## Section 16 — Accessibility & Responsive QA

```
Final pass before considering the frontend launch-ready:

1. Keyboard-only walkthrough of every flow (login, statement view, member
   add, notice create) — confirm full functionality with no mouse.
2. Confirm visible focus rings appear on every interactive element (the
   2px brass ring from the design system) — check this wasn't accidentally
   suppressed by a CSS reset.
3. Run an automated contrast check (axe DevTools or similar) across every
   screen, fix any failures against the WCAG AA floor.
4. Test at 375px width (small phone) through 1280px+ (admin desktop) —
   confirm nothing breaks or requires horizontal scroll on mobile.
5. Confirm prefers-reduced-motion actually disables the stamp animation and
   any other motion, tested with the OS setting turned on, not just read in
   code.
6. Touch-target audit on mobile — every button/link at least 44x44px.

Deliverable: an ACCESSIBILITY_CHECKLIST.md recording what was tested and
when, same pattern as the backend's security checklist.
```

---

## Section 17 — Deployment

```
1. Connect the repo to Cloudflare Pages (or Vercel), confirmed free with no
   credit card required.
2. Set VITE_API_URL per environment (staging/production) in the hosting
   dashboard, never committed to the repo.
3. Confirm the production build (`npm run build`) actually loads the
   self-hosted fonts correctly and the Tailwind purge hasn't stripped any
   dynamically-applied classes (a common Tailwind production bug — check
   status badges and dynamic variant classes specifically).
4. Set up preview deployments on pull requests so you can review a change
   visually before merging to main.

Deliverable: a live staging URL reflecting the real design system, fonts,
and the full section 0-16 build.
```

---

*Same rule as the backend playbook: don't skip ahead. Section 1 (the base components) is what every later section is built from — get the LedgerRow and StampMark right there, once, rather than rebuilding statement/notice/log styling three separate times.*
