# Task Checklist TASK-008

## Source
- Task: TASK-008
- Plan: `agents/task/TASK-008-plan.md`

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

**Cycle 1: Unit tests for service**
- [x] Write `backend/tests/service.test.ts` — 44 tests covering VALID_TRANSITIONS, updateStatus, filtering, pagination, trimming, enum combinations
- [x] Test VALID_TRANSITIONS: 12 cases (all valid transitions, invalid, no-op)
- [x] Test filtering: status, priority, category, dateFrom, dateTo, pagination, empty result

**Cycle 2: Flow tests**
- [x] Write `backend/tests/flows.test.ts` — 19 tests: full user journey (11 steps) + admin journey (9 steps)
- [x] User journey: register → login → create → list → detail → comment → comments → change status → change priority → other user 404 → detail includes comments
- [x] Admin journey: login → list all → any detail → any status change → any priority change → any comment → filtered list → date filter → health

**Cycle 3: Edge cases**
- [x] Trimming tests in service.test.ts (title, description)
- [x] All 20 category × priority combinations in service.test.ts
- [x] Admin date filter test in incidents.test.ts

**Cycle 4: Frontend API service tests**
- [x] Write `frontend/tests/api.test.ts` — 6 tests: login success, login error, getMe with token, getMe 401 clears token, getIncidents with params, createIncident

**Cycle 5: Housekeeping**
- [x] Remove `backend/tests/placeholder.test.ts`
- [x] Remove `frontend/tests/placeholder.test.tsx`

### 3. Scope and Docs
- [x] All TDD cycles complete.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs.
- [x] Durable docs updated if needed.

### 4. Database Change Controls
Not applicable.

### 5. Validation (→ validated)
- [x] Backend tests: 145 pass (auth 11 + roles 5 + incidents 65 + service 44 + flows 19 + role 5 - 1 removed placeholder)
- [x] Frontend tests: 6 pass (api.test.ts)
- [x] Backend lint: clean
- [x] Frontend lint: clean
- [x] Typecheck (both): clean
- [x] Build (frontend): builds
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
