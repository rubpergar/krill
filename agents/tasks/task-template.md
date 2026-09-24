# Task Plan + Execution Template

Copy this file to `agents/tasks/todo/TASK-XXX.md` while planning. After explicit user approval, move the same file to `agents/tasks/current/TASK-XXX.md`. Do not implement from this template.

The task directory is the lifecycle state. Do not add a `status` field to the frontmatter. See `agents/docs/task-lifecycle.md` for the complete contract.

## Frontmatter

```md
---
id: TASK-XXX
title: Short task title
created: YYYY-MM-DD
approved_at: YYYY-MM-DDTHH:MM:SSZ # required only after approval in current/
archived_at: YYYY-MM-DD # summary metadata only in archive/
---
```

Omit metadata that does not apply yet. In particular, a todo task has no `approved_at`, and an active task has no `archived_at`.

## Plan

### Summary
What will change and why?

### Scope
**In:**
- ...

**Out (explicitly excluded):**
- ...

### Current Behavior
...

### Target Behavior
...

### Acceptance Criteria
- ...

### Edge Cases
- ...

### Assumptions / Risks
- ...

### Database Impact
Use `Not applicable` when the task does not affect the database.

- Change summary:
- DB schema file from Source of Truth Map:
- DB change log file from Source of Truth Map:
- Affected structures/data:
- Forward migration approach:
- Rollback approach:
- Persisted data compatibility:
- Operational risks:
- Validation plan:
- Backup/recovery notes:
- Required doc updates:

### Open Questions
- ...

### Decision Records
- ADRs read from `agents/docs/decisions.md`:
- New decisions to record after user approval:

## Execution

The Execution section is persistent hot context. `/implement` must preserve it when resuming and must not regenerate it. Every item and evidence entry should be updated in the same task file as the work progresses.

### Context
- [ ] Re-read the approved plan and referenced source-of-truth docs before implementation.
- [ ] Load and apply `.opencode/skills/tdd/SKILL.md`, or record why it does not apply.
- [ ] Verify no open questions block implementation.

### Resume State
- Phase: `planning` (todo only) | `ready_to_implement` | `implementing` | `reviewing` | `blocked` | `ready_for_closeout`
- Next action: ...
- Blockers: None
- Last validation: Not run
- Last checkpoint: ...
- Scope changes: None
- Updated: YYYY-MM-DDTHH:MM:SSZ

### TDD Ledger

Track each behavior or subtask from the approved plan through RED → GREEN. Preserve completed items and append evidence; do not reset them when resuming. Refactoring is not a ledger step; it belongs to the review stage.

- [ ] Behavior/subtask 1:
  - [ ] RED: pending; Evidence:
  - [ ] GREEN: pending; Evidence:
- [ ] Behavior/subtask 2:
  - [ ] RED: pending; Evidence:
  - [ ] GREEN: pending; Evidence:

### Checkpoint Log

Append only interruptions, blockers, scope changes, and important validation results. This is not a second checklist.

- YYYY-MM-DDTHH:MM:SSZ | checkpoint | result | next action

### Converge

Contrast the implementation against the approved plan and acceptance criteria before closeout.

- [ ] Every acceptance criterion has evidence (test, behavior, or documented exception).
- [ ] No unrelated refactors or out-of-scope changes.
- [ ] Out-of-scope findings registered in `agents/docs/debt.md`.
- [ ] Durable docs updated (API, DB files, design, decisions) as needed.
- [ ] Durable decisions recorded in `agents/docs/decisions.md` with user approval, or deliberately left task-local.

### Validation
- [ ] Targeted tests:
- [ ] Full test suite:
- [ ] Lint:
- [ ] Typecheck:
- [ ] Build:
- [ ] `agents/docs/dod.md` criteria checked while the task is still in `current/`:

### Closeout Evidence
- [ ] Independent review completed and findings resolved or documented.
- Closeout approval: `pending | approved | declined`; Evidence:
- Historical summary decision: `pending | retain | omit`; Reason:
- [ ] If retained, compact summary written to `agents/tasks/archive/`.
- [ ] Task removed from `agents/tasks/current/` only after all preceding steps succeed.
