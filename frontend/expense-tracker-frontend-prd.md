# Expense Tracker — Frontend Product Requirements Document (PRD)

---

## 1. Overview

The Expense Tracker frontend is a React + TypeScript single-page application (SPA) that provides:

- User authentication (register/login)
- CRUD workflows for categories and transactions
- Transaction listing with filters and pagination
- Basic profile viewing/editing
- A public landing page

The frontend integrates with the existing backend API and must follow its data rules and error semantics.

---

## 2. Goals (V1)

- Provide a simple, responsive UI for daily expense tracking.
- Maintain a clear separation between:
  - UI components
  - feature logic
  - API calls
- Keep the app easy to extend (feature-based architecture), while avoiding premature complexity.

---

## 3. Non-Goals (V1)

- Offline-first support
- Multi-currency support
- Advanced analytics dashboards beyond basic listing/filtering
- Full design system beyond shadcn UI components
- Adapter pattern / multi-backend support (explicitly postponed)

---

## 4. Target Users

- Individual users tracking personal income/expenses.
- Users who want simple category organization and transaction history.

---

## 5. UX Principles

- Minimal steps to add an expense/income.
- Clear feedback for actions (success/error toasts, inline field errors).
- Predictable navigation (public vs authenticated areas).
- Fast perceived performance (loading states + cached lists).

---

## 6. Technology Stack

### 6.1 Core

- React (target version: 19)
- TypeScript

### 6.2 UI + Styling

- Tailwind CSS
- shadcn/ui components (generated into `src/shared/ui/shadcn/`)

### 6.3 Forms + Validation

- React Hook Form (form state and submissions)
- Zod (validation + shared schemas/types)

### 6.4 Routing

- React Router (Declarative mode)

### 6.5 Data Fetching

- Axios (HTTP client)
- TanStack Query (server-state caching, mutations, invalidation)

### 6.6 Tables

- TanStack Table (transaction list table behavior)

### 6.7 Notifications

- React Toastify (global toasts)

### 6.8 Optional (postponed)

- Zustand (client-state store) — use only if later needed for cross-feature UI state.

---

## 7. Architecture

### 7.1 Architecture Pattern

**Feature-Based Architecture**:

- Each feature owns its pages, feature UI, API functions, and schemas.
- Cross-feature reusable code lives in `shared/`.
- App-level wiring (router, layouts, providers) lives in `app/`.

### 7.2 Folder Structure (no `entities/`, no barrels)

```
src/
  app/
    layouts/
      PublicLayout.tsx
      AuthLayout.tsx
      AppLayout.tsx
    providers/
      QueryProvider.tsx
      ToastProvider.tsx
    router/
      routes.tsx
      ProtectedRoute.tsx

  features/
    landing/
      pages/
        LandingPage.tsx
      ui/
        LandingHeader.tsx
        Hero.tsx
        LandingFooter.tsx

    auth/
      pages/
        LoginPage.tsx
        RegisterPage.tsx
      ui/
        LoginForm.tsx
        RegisterForm.tsx
        CardFormWrapper.tsx  (optional: can be shared if used elsewhere)
      api/
        login.ts
        register.ts
        session.ts
      schemas/
        authSchemas.ts

    categories/
      pages/
        CategoriesPage.tsx
      ui/
        CategoryForm.tsx
        CategoryList.tsx
      api/
        categoriesApi.ts
      schemas/
        categorySchemas.ts

    transactions/
      pages/
        TransactionsPage.tsx
      ui/
        TransactionForm.tsx
        TransactionsTable.tsx
        FiltersBar.tsx
      api/
        transactionsApi.ts
      schemas/
        transactionSchemas.ts

    profile/
      pages/
        ProfilePage.tsx
      ui/
        ProfileForm.tsx
      api/
        profileApi.ts
      schemas/
        profileSchemas.ts

  shared/
    lib/
      api/
        httpClient.ts
      utils/
        cn.ts
    ui/
      shadcn/
        (generated components)
      common/
        (small reusable components, if truly cross-feature)
```

**Rule**: if a component is only used within one feature (e.g., landing hero), keep it in that feature. If reused across multiple features, move it to `shared/`.

---

## 8. Routing & Layouts

### 8.1 Public routes

- `/` → Landing
- `/login` → Login
- `/register` → Register

### 8.2 Protected routes (requires session)

- `/app/transactions`
- `/app/categories`
- `/app/profile`

### 8.3 Layout usage

- `PublicLayout`: Landing (and future public pages like /privacy, /terms if added)
- `AuthLayout`: Login/Register pages (centered card layout)
- `AppLayout`: The authenticated shell (navigation, logout button, etc.)

### 8.4 ProtectedRoute behavior

- On initial load, call **session endpoint** (see API integration).
- While loading: show a neutral loader state.
- If unauthorized: redirect to `/login`.
- If authorized: render `AppLayout` + nested routes.

---

## 9. State Management Strategy

### 9.1 Server state (default)

Use TanStack Query for:

- session/user info
- categories list
- transactions list (filters + pagination)
- create/update/delete mutations (invalidate lists)

### 9.2 Client/UI state

Prefer local component state.
Introduce Zustand only if:

- state must be shared across distant features
- and React state lifting becomes unwieldy

---

## 10. Forms & Validation

- Use Zod schemas to define and validate form inputs.
- Use React Hook Form to manage form state, errors, and submissions.
- Keep backend-aligned data rules (date format, amount limits, etc.) in shared Zod schemas per feature.

---

## 11. API Integration Contract

### 11.1 Base URL

Frontend must read API base URL from an environment variable (e.g., `VITE_API_BASE_URL`).

### 11.2 Cookies / Credentials

The backend uses **HTTP-only cookies** for JWT storage. The frontend must send credentials with requests (Axios `withCredentials: true`) and must not attempt to read tokens in JS.

### 11.3 Response format expectations

Backend defines a consistent “success / message / data” response shape and an “error response” shape. The frontend must:

- Read and display `message` where appropriate
- Treat non-2xx HTTP statuses as errors
- Map status codes to UX behavior (see Error Handling)

### 11.4 Status codes

Frontend must respect the backend’s status code usage and render meaningful UI states:

- 400: validation errors (show inline where possible)
- 401: unauthenticated (redirect to login if session-required)
- 403: forbidden (show toast, remain on page)
- 404: not found (show not-found UI)
- 409: conflicts (show toast; field-level if applicable)
- 500: generic error toast

---

## 12. Feature Requirements

### 12.1 Landing

**Goal**: explain what the app does and drive users to register/login.

Must include:

- Header (logo/name, links to Login/Register)
- Hero (headline + CTA)
- Simple features section (3–6 bullets)
- Footer (minimal)

Non-goals:

- Complex marketing pages

### 12.2 Authentication

#### 12.2.1 Register

- Call backend `POST /api/auth/register`.
- On success, choose one of:
  - Navigate to `/login` with success toast, OR
  - Auto-login (only if backend already sets cookie on register).

**Needs confirmation**: which post-register behavior you want as final (redirect vs auto-login).

#### 12.2.2 Login

- Call backend `POST /api/auth/login`.
- On success:
  - Invalidate/refetch session query
  - Navigate to `/app/transactions`

#### 12.2.3 Session / current user

Frontend must use the backend “get current user” endpoint to determine auth status on refresh.

**Note**: Backend PRD defines `GET /api/users/info` for current authenticated user info. If you later expose a dedicated `GET /api/auth/me`, update only the session API function and keep the rest stable.

#### 12.2.4 Logout

**Needs confirmation**: the backend logout endpoint (not provided in your messages).
Until confirmed, logout is “planned”.

### 12.3 Profile

- View current user info (from session endpoint).
- Update profile via `PATCH /api/users/profile`.
- Success: toast + update session cache.

### 12.4 Categories

- List all categories for the user via `GET /api/categories/`.
- Filter by type using query param (income/expense).
- Create category via `POST /api/categories/`.
- Update via `PATCH /api/category/:id`.
- Delete via `DELETE /api/category/:id` with conflict handling if category has transactions.

### 12.5 Transactions

#### 12.5.1 Data rules (must match backend)

- Date must be `YYYY-MM-DD` (date-only).
- Amount > 0, max 2 decimals, and within `DECIMAL(10,2)` capacity.
- Pagination uses `limit` and `offset`.
- Ordering: latest first.

#### 12.5.2 List transactions

- `GET /api/transactions` with optional filters:
  - `type`, `categoryId`, `startDate`, `endDate`, `limit`, `offset`
- UI requirements:
  - Filters bar (type, category, date range)
  - Table list (TanStack Table)
  - Pagination controls (Next/Prev; page size options)

#### 12.5.3 Create / Update / Delete

- Create: `POST /api/transactions`
- Update (partial): `PATCH /api/transactions/:id`
- Delete: `DELETE /api/transactions/:id`

### 12.6 Financial summary (planned / deferred)

Backend PRD marks `GET /api/transactions/summary` as Planned/Deferred.
Frontend should not implement summary UI in v1 unless backend is implemented.

---

## 13. Error Handling UX

- Use inline validation errors for field-level issues (Zod + RHF).
- Use Toastify for global errors/success:
  - Create/update/delete success
  - Network/server errors
  - Forbidden/conflict errors
- Authentication errors must not reveal whether the email exists (“Invalid credentials” style).

---

## 14. Security Requirements (Frontend)

- Do not store JWT in localStorage/sessionStorage.
- Rely on HTTP-only cookies, and ensure requests include credentials.
- Handle 401 consistently:
  - On protected routes: redirect to `/login`.
  - On public routes: show error toast.

---

## 15. Non-Functional Requirements

### 15.1 Performance

- Avoid unnecessary refetching (use Query caching + invalidation).
- Keep transaction list responsive with pagination (and optional table optimizations later).

### 15.2 Accessibility (A11y)

- All inputs must have labels.
- Keyboard navigation must work for forms and primary actions.
- Color usage must not be the only way to convey meaning.

### 15.3 Responsive design

- Mobile-friendly auth pages and lists.
- Tables may collapse to cards on smaller screens (future enhancement if needed).

---

## 16. Development Workflow & Quality Gates

### 16.1 Tooling

- Node.js: >= 20
- Package manager: pnpm >= 10
- Lint/format: Biome (frontend config aligned to backend style decisions)

### 16.2 Script naming

Keep script names aligned with backend (`dev`, `build`, `start`, `lint`, `format`, `check`, `type-check`) to maintain consistency across repos.

### 16.3 Biome requirements (frontend)

- No semicolons (asNeeded)
- Single quotes
- 2-space indentation
- 100 char line width

---

## 17. Open Questions / Needs Confirmation

1. **Logout endpoint**: not provided. (Needed to finish auth flows.)
2. **Post-register behavior**: redirect to login vs auto-login.
3. **Exact API response shape**: backend PRD defines a generic wrapper; confirm if all endpoints follow it.
4. **Hosting / deployment**: not specified (Vercel/Netlify/static hosting).
5. **Route paths**: confirm whether you prefer `/app/*` or `/dashboard/*`.

---

## Document History

| Version | Date | Author | Changes |
| --- | --- | --- | --- |
| 1.0 | 2026-01-29 | Development Team | Initial frontend PRD created (aligned to backend API + frontend stack decisions) |
| 1.0.1 | 2026-01-29 | Development Team | Added explicit local tooling expectations (Node.js + pnpm minimum versions) |

---

**End of Document*
