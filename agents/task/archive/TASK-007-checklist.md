# Task Checklist TASK-007

## Source
- Task: TASK-007
- Plan: `agents/task/TASK-007-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.
- **ALL checkboxes must start `[ ]` (unchecked). Never pre-mark items when generating the checklist.**
- Mark completed items during implementation only.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs.
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

**Cycle 1: Dependencies + Tailwind config**
- [x] Install react-router-dom, lucide-react
- [x] Configurar design tokens (colores, border-radius) en tailwind.config.ts

**Cycle 2: API service layer**
- [x] Implement api.ts with fetch wrapper + methods (login, register, getMe, getIncidents, createIncident)

**Cycle 3: Auth Context**
- [x] Implement AuthContext with login/logout/persist + ProtectedRoute

**Cycle 4: Pages + Layout + Routing**
- [x] Implement Navbar/Header component
- [x] Implement ProtectedRoute wrapper
- [x] Implement Login page
- [x] Implement Register page
- [x] Implement Dashboard (bento grid)
- [x] Wire up App.tsx with routes

### 3. Scope and Docs
- [x] All TDD cycles complete.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs.
- [x] Durable docs updated (`agents/docs/design.md`).

### 4. Database Change Controls
Not applicable — frontend.

### 5. Validation (→ validated)
- [x] Lint (frontend): clean
- [x] Typecheck (frontend): clean
- [x] Build (frontend): builds with Vite
- [x] Backend lint/typecheck/tests (regression): 81/81, lint clean, typecheck clean
- [x] DoD validated criteria checked

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
...
