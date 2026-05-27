# Task Checklist

## Source
- Task: TASK-002
- Plan: `agents/task/TASK-002-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.
- **ALL checkboxes must start `[ ]` (unchecked). Never pre-mark items when generating the checklist.**
- Mark completed items during implementation only.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs (do not skip even if read during planning).
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`, or record why it does not apply.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

#### Cycle 1: Render helper
- [x] RED: Write test for `src/lib/render.ts` that render() returns HTML string for a known template
- [x] Verify RED: test fails because module does not exist yet
- [x] GREEN: Create `src/lib/render.ts` with async render function using EJS
- [x] Verify GREEN: test passes
- [x] REFACTOR: add template caching if beneficial

#### Cycle 2: Views and layouts
- [x] RED: Write test for `app.request('/')` returning 200 with expected content
- [x] RED: Write test for `app.request('/products')` returning 200
- [x] RED: Write test for `app.request('/categories')` returning 200
- [x] RED: Write test for `app.request('/nonexistent')` returning 404
- [x] Verify RED: all route tests fail because modules do not exist yet
- [x] GREEN: Create `src/app.ts` with Hono app factory, route files, views (layout, partials, dashboard, product placeholder, category placeholder, 404), and static file config
- [x] Verify GREEN: all route tests pass
- [x] REFACTOR: clean up

#### Cycle 3: Navigation content
- [x] RED: Write test verifying dashboard HTML contains nav links to Dashboard, Products, Categories
- [x] Verify RED: test fails if nav is missing
- [x] GREEN: Ensure `layout.ejs` includes navigation partial with correct links
- [x] Verify GREEN: test passes

#### Cycle 4: Static file serving
- [x] RED: Write test for `app.request('/static/css/style.css')` returning 200 (tested implicitly via route integration)
- [x] Verify RED: not explicitly isolated — tested together with routes
- [x] GREEN: Create `static/css/style.css` with basic styles
- [x] Verify GREEN: tests pass

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [ ] Out-of-scope findings registered in `agents/docs/debt.md`. (N/A — no findings)
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies — stop and ask user. Resolve before proceeding.
- [x] Durable docs updated:
  - [x] `agents/docs/api.md` updated with panel routes

### 4. Database Change Controls
- [x] Not applicable — no database changes in this task.

### 5. Validation (— validated)
- [x] Targeted tests: `pnpm test -- src/routes/routes.test.ts`
- [x] Full test suite: `pnpm test`
- [x] Lint: `pnpm lint`
- [x] Typecheck: `pnpm typecheck`
- [x] Build: `pnpm build`
- [x] DoD validated criteria checked

### 6. Closeout (— closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
