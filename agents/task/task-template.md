# Task Plan + Execution Template

Copy this file to `agents/task/TASK.md` when planning starts. Do not implement from this template.

The task file is the lifecycle state; there is never more than one active task and it lives at the fixed path `agents/task/TASK.md`. Do not add a `status` field to the frontmatter. See `agents/docs/task-lifecycle.md` for the complete contract.

## Frontmatter

```md
---
title: Short task title
created: YYYY-MM-DD
approved_at: YYYY-MM-DDTHH:MM:SSZ # add only after explicit user approval
---
```

Omit `approved_at` while the phase is `planning`. No task id and no `archived_at` are used.

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
- Phase: `planning` | `ready_to_implement` | `implementing` | `reviewing` | `blocked` | `ready_for_closeout`
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
- [ ] `agents/docs/dod.md` criteria checked while the task file is still present:

### Review Findings

Every `/review` finding is recorded here with its disposition. `blocking` and `important` findings must be `fixed`, `dismissed` with a reason, or `deferred` to `agents/docs/debt.md` with user consent; `nit` findings may be deferred or dismissed. `ready_for_closeout` requires no open `blocking` or `important` finding.

- Finding | severity | disposition | evidence or reason

### Closeout Evidence
- [ ] Independent review completed; every finding dispositioned in `Review Findings`.
- [ ] Durable docs synchronized during the task (API, DB files, design, decisions).
- [ ] Task file `agents/task/TASK.md` deleted only after the work is integrated.
