# TASK-019 Checklist — Pruebas de seguridad, revisión de privacidad y documentación básica

## Source
- Task: TASK-019
- Plan: `agents/task/TASK-019-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.
- Mark completed items during implementation only.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs.
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`.
- [x] Read and apply `agents/skills/security-review/SKILL.md` for security/privacy review focus.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger
- [x] Behavior/subtask 1: `/privacidad` is public and contains required privacy sections.
- [x] Behavior/subtask 2: public form links consent text to `/privacidad`.
- [x] Behavior/subtask 3: confirmation page does not expose submitted PII.
- [x] Behavior/subtask 4: private lead/user routes remain protected for guests.
- [x] Behavior/subtask 5: inactive users are blocked from private resources.
- [x] Behavior/subtask 6: active non-admin users cannot manage users or physically delete leads.
- [x] Behavior/subtask 7: honeypot does not create leads.
- [x] Behavior/subtask 8: rate limit returns 429 after allowed attempts.
- [x] Behavior/subtask 9: documentation covers privacy/security controls and residual risks.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan.
- [x] Durable docs updated as needed.

### 4. Database Change Controls
- [x] Not applicable: DB schema file unchanged.
- [x] Not applicable: DB change log file unchanged.
- [x] Persisted data compatibility reviewed.
- [x] Backup/recovery expectation reviewed.
- [x] Pre-check and post-check validation steps recorded when needed.

### 5. Validation (-> validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_019/SecurityPrivacyTest.php --stop-on-failure --compact`
- [x] Full test suite: `php artisan test`
- [x] Lint: `./vendor/bin/pint --test`
- [x] Typecheck: not available
- [x] Build: `npm run build`
- [x] DoD validated criteria checked: `agents/docs/DoD.md`

### 6. Closeout (-> closed)
- [x] Ask user before marking backlog task done.
- [x] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [x] Closed (section 6 complete + user approval)

## Resume Notes
- Implement recommended behavior: basic public privacy page plus regression tests and internal security/privacy documentation.
