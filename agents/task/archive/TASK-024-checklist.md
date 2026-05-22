# TASK-024 Checklist

## Source
- Task: TASK-024
- Plan: `agents/task/TASK-024-plan.md`

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
Track each behavior/subtask from the plan through RED → GREEN → REFACTOR cycles.

- [x] Behavior/subtask 1: Apply the `Oceanic SaaS Logic` tokens from `agents/docs/design.md` across reusable app styling, including colors, typography, spacing, radius and focus states.
- [x] Behavior/subtask 2: Replace the public form styling in `resources/views/formulario.blade.php` with the new design system while preserving all fields, CSRF, honeypot, validation and link to the admin panel.
- [x] Behavior/subtask 3: Replace the confirmation page styling in `resources/views/confirmacion.blade.php` with the new design system while preserving the success message and return link.
- [x] Behavior/subtask 4: Configure Filament in `app/Providers/Filament/AdminPanelProvider.php` to use the new primary color and font so the admin shell matches the design system.
- [x] Behavior/subtask 5: Adjust the `LeadResource` presentation where Filament configuration allows it so the lead table feels integrated with the new visual language without changing columns, filters, pagination or ordering.
- [x] Behavior/subtask 6: Centralize reusable CSS/theme tokens in the app assets (preferably `resources/css/app.css` with Tailwind CSS 4 `@theme`) and, if needed, replace Tailwind CDN usage in public views with the Vite pipeline.
- [x] Behavior/subtask 7: Add or update feature tests to protect the public pages and admin surfaces after the redesign, keeping assertions focused on behavior and key content.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/design.md`, `agents/docs/api.md`, DB files from the Source of Truth Map, etc.) as needed.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database.

- [x] DB schema file from the Source of Truth Map updated to the resulting schema state.
- [x] DB change log file from the Source of Truth Map updated with forward SQL and rollback notes.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling.
- [x] Backup or recovery expectation documented for destructive or risky changes.
- [x] Pre-check and post-check validation queries or steps recorded when needed.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test --filter=TASK_024` (not required; validation covered by full suite)
- [x] Full test suite: `php artisan test` → 56 tests, 194 assertions, all passed
- [x] Lint: `./vendor/bin/pint --test` → passed
- [x] Typecheck: `not available`
- [x] Build: `npm run build` → passed
- [x] DoD validated criteria checked: changed views/theme/config only, no DB or behavior changes, build/lint/tests passed, checklist updated, task not closed

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
Validated and ready for user review. Not closed by request.
