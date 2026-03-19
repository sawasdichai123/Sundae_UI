# SUNDAE Frontend Prototype — Browser Flow Test (for Antigravity AI Agent)

## Goal
Verify the standalone **prototype** UI works end-to-end **without any real backend / Supabase**.
All data is mocked via `localStorage` (`mockDb`) and in-memory UI state.

## Preconditions
- Run the dev server:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
- Open the app URL shown in terminal (usually `http://localhost:5173/`).

## Capture Protocol (MUST)
For **every page visited** and **every major state change**, capture a screenshot.

### What each screenshot must include
- Current **URL** visible (address bar)
- Logged-in **role/email** visible somewhere (top bar / profile / user card). If not visible, open Profile and capture.
- The main content area (avoid only partial UI)

### Naming convention
Save screenshots using this template:

`CAPTURE/<flow>/<role>/<step>-<route>-<state>.png`

Examples:
- `CAPTURE/flow1/admin/01-login-login-page.png`
- `CAPTURE/flow1/admin/04-kb-knowledge-base-list.png`
- `CAPTURE/flow2/support/02-approvals-list.png`

If the agent cannot write files, it must still “capture” by returning an image artifact and labeling it using the same convention.

## Prototype Login Accounts
In prototype mode, login is based on **email lookup** in mock data. Password is ignored by the mock auth layer.

Use any password (recommended: `demo`).

- Admin
  - Email: `admin@sundae.local`
  - Password: `demo`
- Support
  - Email: `support@sundae.local`
  - Password: `demo`
- Approved User
  - Email: `user@sundae.local`
  - Password: `demo`
- Pending (unapproved)
  - Email: `pending@sundae.local`
  - Password: `demo`

## Global Checks (apply to every role)
- The app must not crash on navigation.
- No real network calls should be required.
- If the agent can inspect DevTools console:
  - No unhandled exceptions.

## Flow 0 — Clean Start (recommended)
1. Open the app.
2. Clear storage:
   - Clear site data / localStorage for the app origin.
3. Refresh the page.
4. Expected:
   - Redirect to `/login`.
5. Capture:
   - `CAPTURE/flow0/anonymous/01-redirect-login.png`

---

## Flow 1 — Admin Role Full Navigation
### 1. Login
1. Go to `/login`.
2. Enter:
   - Email: `admin@sundae.local`
   - Password: `demo`
3. Click **เข้าสู่ระบบ**.
4. Expected:
   - Redirect to `/` (Dashboard)
   - Sidebar shows items (Admin):
     - Dashboard
     - Knowledge Base
     - Bots
     - Inbox
     - Integration
     - Approvals
     - Web Chat
     - Organization
5. Capture:
   - `CAPTURE/flow1/admin/01-login-success.png`

### 1.1 Profile (baseline capture)
1. Navigate to `/profile`.
2. Expected:
   - User email and role shown.
3. Capture:
   - `CAPTURE/flow1/admin/02-profile.png`

### 2. Dashboard
1. On `/`.
2. Expected:
   - Metric cards render (documents/bots/sessions etc.)
   - No “Pending Approval” lockout screen.
3. Capture:
   - `CAPTURE/flow1/admin/03-dashboard.png`

### 3. Knowledge Base
1. Navigate to `/knowledge-base`.
2. Expected:
   - Document list renders.
   - Upload action should work in prototype (adds a document to mockDb).
3. Actions:
   - If there is an upload button, upload any small file.
   - Verify the new document appears in the list.
4. Capture:
   - `CAPTURE/flow1/admin/04-kb-list.png`
   - `CAPTURE/flow1/admin/05-kb-after-upload.png`

### 4. Bots
1. Navigate to `/bots`.
2. Expected:
   - Bot list renders.
   - Create bot works (adds to mockDb).
3. Actions:
   - Create 1 bot (any name).
   - Toggle active/web-enabled if available.
4. Capture:
   - `CAPTURE/flow1/admin/06-bots-list.png`
   - `CAPTURE/flow1/admin/07-bots-after-create.png`

### 5. Inbox
1. Navigate to `/inbox`.
2. Expected:
   - Sessions list renders.
   - Selecting a session loads messages.
   - `user_name` displays as text or empty (must not be `undefined`).
3. Actions:
   - Click first session.
   - Send 1 message if UI allows.
4. Capture:
   - `CAPTURE/flow1/admin/08-inbox-list.png`
   - `CAPTURE/flow1/admin/09-inbox-thread.png`

### 5.1 Integration
1. Navigate to `/integration`.
2. Expected:
   - Integration page renders (even if values are mock).
3. Capture:
   - `CAPTURE/flow1/admin/10-integration.png`

### 6. Approvals
1. Navigate to `/approvals`.
2. Expected:
   - Pending users list renders.
   - Approve/Reject updates UI.
3. Actions:
   - If `pending@sundae.local` exists, test:
     - Approve (or Reject), confirm UI updates.
4. Capture:
   - `CAPTURE/flow1/admin/11-approvals-list.png`
   - `CAPTURE/flow1/admin/12-approvals-after-action.png`

### 7. Web Chat
1. Navigate to `/chat`.
2. Expected:
   - Sending message returns mocked streaming answer.
   - Source chips/sections render.
3. Actions:
   - Send: `สรุป policy ลาพักร้อนให้หน่อย`
   - Wait until streaming completes.
4. Capture:
   - `CAPTURE/flow1/admin/13-chat-before-send.png`
   - `CAPTURE/flow1/admin/14-chat-after-stream.png`

### 8. Organization (Org Settings)
1. Navigate to `/organization`.
2. Expected:
   - Page loads org details.
   - Owner/Admin can edit org name and save successfully.
   - Danger Zone:
     - Owner can request deletion.
     - Support/Admin can confirm deletion (prototype: should complete and redirect to `/create-org`).
3. Actions:
   - Edit org name to a new value and save.
4. Capture:
   - `CAPTURE/flow1/admin/15-org-settings.png`
   - `CAPTURE/flow1/admin/16-org-after-rename.png`

### 9. Logout
1. Click logout in the layout.
2. Expected:
   - Redirect to `/login`.
   - Protected routes redirect to `/login`.
3. Capture:
   - `CAPTURE/flow1/admin/17-logout-login.png`

---

## Flow 2 — Support Role Restrictions
### 1. Login as Support
- Email: `support@sundae.local`
- Password: `demo`

Capture:
- `CAPTURE/flow2/support/01-login-success.png`

### 2. Navigation restrictions
1. After login, try to access each route:
   - Allowed:
     - `/approvals`
     - `/chat`
     - `/create-org`
     - `/profile`
   - Must be blocked (should redirect to `/` or safe home):
     - `/knowledge-base`
     - `/bots`
     - `/inbox`
     - `/integration`
     - `/organization`
2. Expected:
   - Sidebar shows **Approvals** and **Web Chat** (and basic allowed items).

3. Capture (at least one per category):
   - Allowed page:
     - `CAPTURE/flow2/support/02-approvals.png`
     - `CAPTURE/flow2/support/03-chat.png`
     - `CAPTURE/flow2/support/04-create-org.png`
     - `CAPTURE/flow2/support/05-profile.png`
   - Blocked page attempts (capture the redirect result page URL):
     - `CAPTURE/flow2/support/06-blocked-kb.png`
     - `CAPTURE/flow2/support/07-blocked-bots.png`
     - `CAPTURE/flow2/support/08-blocked-inbox.png`
     - `CAPTURE/flow2/support/09-blocked-integration.png`
     - `CAPTURE/flow2/support/10-blocked-organization.png`

---

## Flow 3 — Approved User Role
### 1. Login as User
- Email: `user@sundae.local`
- Password: `demo`

Capture:
- `CAPTURE/flow3/user/01-login-success.png`

### 2. Expected access
- Allowed:
  - Dashboard
  - Knowledge Base
  - Bots
  - Inbox
  - Integration
  - Web Chat
  - Organization (only if owner; if not owner, sidebar item should not be shown)
- Not allowed:
  - Approvals

### 3. Capture all pages user can reach
Capture each page after it fully loads:
- `CAPTURE/flow3/user/02-dashboard.png`
- `CAPTURE/flow3/user/03-knowledge-base.png`
- `CAPTURE/flow3/user/04-bots.png`
- `CAPTURE/flow3/user/05-inbox.png`
- `CAPTURE/flow3/user/06-integration.png`
- `CAPTURE/flow3/user/07-chat.png`
- `CAPTURE/flow3/user/08-profile.png`

Also attempt `/approvals` and capture the redirect result:
- `CAPTURE/flow3/user/09-blocked-approvals.png`

---

## Flow 4 — Pending (Unapproved) User Lockout
### 1. Login as Pending
- Email: `pending@sundae.local`
- Password: `demo`

Capture:
- `CAPTURE/flow4/pending/01-login-success.png`

### 2. Expected UI behavior
1. Go to `/`.
2. Expected:
   - “Pending Approval” / lockout screen.
3. Go to `/chat`.
4. Expected:
   - Web chat page should still be accessible.

5. Capture:
   - `CAPTURE/flow4/pending/02-lockout-dashboard.png`
   - `CAPTURE/flow4/pending/03-chat-access.png`

---

## Flow 5 — Auth Utility Screens (Prototype)
### Forgot Password
1. Go to `/forgot-password`.
2. Enter any email.
3. Submit.
4. Expected:
   - Success state shown (prototype simulated).

5. Capture:
   - `CAPTURE/flow5/public/01-forgot-password.png`

### Reset Password
1. Go to `/reset-password`.
2. Enter a valid new password + confirm.
3. Submit.
4. Expected:
   - Redirect to `/login?reset=success`.

5. Capture:
   - `CAPTURE/flow5/public/02-reset-password.png`
   - `CAPTURE/flow5/public/03-login-reset-success.png`

---

## Flow 6 — Organization (Org) Flows

### A) Auto-redirect rules (important)
These redirects are enforced by the layout logic:

1. Approved user with **no orgs**
   - Expected: after login, redirect to `/create-org`.
2. Member (non-owner) user with orgs
   - Expected: visiting `/` redirects to `/chat`.

### B) Create Organization page (`/create-org`)
This page is role-dependent.

1. Support/Admin
   - Go to `/create-org`.
   - Expected:
     - Create org form is visible.
     - Creating an org redirects to `/`.
2. Regular user
   - Go to `/create-org`.
   - If there are invitations:
     - Expected: invitation list visible with Accept/Decline.
   - If there are no invitations and user has no orgs:
     - Expected: “Contact admin” style message (cannot create org).

### C) Organization settings page (`/organization`)
1. Login as Admin.
2. Navigate to `/organization`.
3. Expected:
   - Edit name works (toast success).
   - Request deletion available only to Owner.
   - Confirm deletion available only to Support/Admin when status is pending.

### D) Org membership UI (Dashboard)
Members and invitations are managed from Dashboard UI.

1. Login as Admin.
2. On Dashboard, find member/invite section.
3. Expected:
   - Inviting a member succeeds (adds an invitation in prototype).
   - Removing a member updates the members list.

4. Capture:
   - `CAPTURE/flow6/admin/01-dashboard-members.png`
   - `CAPTURE/flow6/admin/02-dashboard-after-invite.png`
   - `CAPTURE/flow6/admin/03-dashboard-after-remove.png`

---

## Notes for the Agent
- Prototype mode does not require real Supabase environment variables.
- Password is not validated; email selects a user role.
- If a flow fails, capture:
  - Current URL
  - Console error
  - Screenshot (optional)
  - The role used (email)
