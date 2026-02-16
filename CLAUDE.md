# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

### Backend (Spring Boot + Maven)
```bash
cd backend
./mvnw spring-boot:run          # Start backend on :8080
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
./mvnw test -Dtest=ClassName#methodName  # Run a single test method
./mvnw clean package            # Build JAR
```

### Frontend (React + Vite)
```bash
cd frontend
npm run dev      # Start dev server on :5173
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

### Database
```bash
/opt/homebrew/Cellar/postgresql@16/16.10/bin/psql -p 5433 -U postgres -d budgetbuddy
```
PostgreSQL runs on port **5433** (not default 5432), user `postgres`, no password.

## Architecture

**Monorepo** with separate `frontend/` and `backend/` directories. No shared build system — they run independently.

### Backend (`com.budgetbuddy.budget_buddy`)
Standard Spring Boot layered architecture:
- **Controller** → **Service** → **Repository** → **Entity**
- DTOs in `/dto` organized by feature (auth, expense, household, dashboard, user, category)
- Global exception handling via `@RestControllerAdvice` in `GlobalExceptionHandler`
- `DataInitializer` seeds 10 expense categories on startup

### Frontend
- **Pages** (`/pages`): Route-level components
- **Components** (`/components`): Feature-grouped (auth, dashboard, expense, household, layout, common)
- **UI** (`/ui`): Manual shadcn-style primitives (button, card, input, etc.) — not installed via CLI
- **Services** (`/services`): Axios-based API clients per feature
- **Store** (`/store`): Zustand stores (authStore, householdStore) with localStorage persistence
- **Types** (`/types`): TypeScript interfaces per feature

Path alias: `@/` → `src/` (configured in both vite.config.ts and tsconfig)

### Auth Flow
1. Login/signup → backend returns JWT (24h expiry, HS256)
2. Token stored in localStorage, tracked by Zustand `authStore`
3. Axios interceptor (`services/api.ts`) attaches `Authorization: Bearer` header to all requests
4. Backend `JwtAuthenticationFilter` validates token, sets `SecurityContext`
5. Controllers access user via `@AuthenticationPrincipal UserPrincipal`
6. On 401, frontend clears auth state and redirects to `/login`

### Expense/Household Model
- Expenses can be **personal** or **shared** within a household
- Households use UUID invite codes; members have roles (OWNER, MEMBER)
- Dashboard aggregates expenses by category with budget comparisons
- Filtering: personal / shared / all — controlled by query params on `GET /api/expenses`

## Key Configuration
- Vite proxies `/api` → `http://localhost:8080` (no CORS issues in dev)
- Backend CORS allows `localhost:5173` (hardcoded in `WebConfig`)
- Tailwind v4: uses `@import "tailwindcss"` + `@theme` block in `index.css` (no tailwind.config.js)
- Spring Boot: `application.properties` has JPA auto-update DDL, SQL logging enabled

## Conventions
- Backend validation via `@Valid` on request DTOs with Jakarta validation annotations
- Frontend uses Framer Motion for animations and transitions
- Styling utility: `cn()` helper combining clsx + tailwind-merge (in `src/lib/utils.ts`)
