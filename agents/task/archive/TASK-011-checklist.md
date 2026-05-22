# TASK-011 Checklist

## Source
- Task: TASK-011
- Plan: `agents/task/TASK-011-plan.md`

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

- [x] Add a visible Filament action to change the lead status from the lead detail page.
- [x] Restrict the action to valid `LeadStatus` values only.
- [x] Persist the new status on the lead when it changes.
- [x] Create an `EventoAuditoria` only when the status actually changes.
- [x] Record `lead_id`, `usuario_id`, `accion`, `campo`, `valor_anterior`, and `valor_nuevo` in audit rows.
- [x] Prevent no-op writes and no-op audit rows when the selected status equals the current status.
- [x] Enforce access control for guests and inactive users on the detail/action flow.
- [x] Add feature/Livewire tests for state change, audit creation, no-op behavior, invalid status, and access control.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md` when needed. No hallazgos fuera de alcance en esta tarea.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed. No cambios duraderos requeridos.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database schema.

- [x] Not applicable: no schema change is expected.
- [x] Not applicable: no schema change is expected.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling.
- [x] Backup or recovery expectation documented for destructive or risky changes.
- [x] Pre-check and post-check validation queries or steps recorded when needed.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_011/LeadStatusChangeTest.php`
- [x] Full test suite: `php artisan test`
- [x] Lint: `./vendor/bin/pint --test`
- [x] Typecheck: Not available en el proyecto.
- [x] Build: `npm run build`
- [x] DoD validated criteria checked.

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
- TDD aplicado con `tests/Feature/TASK_011/LeadStatusChangeTest.php` antes de implementar la acción.
- La auditoría se registra solo en cambios reales de estado; no-op no crea filas nuevas.
- Hay cambios no relacionados ya presentes en el worktree y no se tocaron en esta tarea.
