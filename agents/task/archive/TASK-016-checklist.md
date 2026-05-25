# TASK-016 Checklist

## Source
- Task: TASK-016
- Plan: `agents/task/TASK-016-plan.md`

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

- [x] Write test: submission sends notification to configured address.
- [x] Implement: create NewLeadNotification Mailable with lead data.
- [x] Implement: create email blade template.
- [x] Implement: configure MAIL_INTERNAL_NOTIFICATION_ADDRESS in config/mail.php.
- [x] Implement: dispatch mail from PublicLeadController after lead creation.
- [x] Write test: email contains lead name, email, phone, company, type, message.
- [x] Write test: no notification sent when address is empty/null.
- [x] Write test: notification sent with correct recipient and count.
- [x] Implement: wrap mail send in try-catch, skip if no recipient.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md` when needed. Sin hallazgos.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Sin discrepancias.
- [x] Durable docs updated as needed. No se requieren.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database schema.

- [x] Not applicable: no schema change is expected.
- [x] Not applicable: no schema change is expected.
- [x] Persisted data compatibility reviewed.
- [x] Backup or recovery expectation documented.
- [x] Pre-check and post-check steps recorded.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_016/LeadNotificationTest.php` — 4/4 passed
- [x] Full test suite: `php artisan test` — 104/104 passed, 384 assertions
- [x] Lint: `./vendor/bin/pint --test` — passed
- [x] Typecheck: Not available en el proyecto.
- [x] Build: `npm run build` — passed
- [x] DoD validated criteria checked.

### 6. Closeout (→ closed)
- [x] Ask user before marking backlog task done.
- [x] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [x] Closed (section 6 complete + user approval)

## Resume Notes
...
