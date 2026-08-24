# Task Plan + Execution Template

Copy to `agents/tasks/current/TASK-XXX.md` (active task) or `agents/tasks/todo/TASK-XXX.md` (pending). Do not implement from this template.

> `agents/tasks/archive/` holds compact historical summaries (cold context). See `AGENTS.md`.

## Frontmatter

```md
---
id: TASK-XXX
status: todo | current | done
title: Short task title
created: YYYY-MM-DD
archived: YYYY-MM-DD
---
```

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

> TDD ledger: track each behavior through RED → GREEN → REFACTOR. Mark items as completed during implementation and closeout only.

### Context
- [ ] Re-read the approved plan and referenced source-of-truth docs (do not skip even if read during planning).
- [ ] Load and apply `agents/skills/test-driven-development/SKILL.md`, or record why it does not apply.
- [ ] Verify no open questions block implementation.
- [ ] Set the plan status to `current` before the first implementation change.

### TDD Ledger
Track each behavior/subtask from the plan through RED → GREEN → REFACTOR cycles.

- [ ] Behavior/subtask 1:
- [ ] Behavior/subtask 2:
- [ ] ...

### Converge
Contrast the implemented code against the approved plan and acceptance criteria before closeout.

- [ ] Every acceptance criterion has evidence (test, behavior, or documented exception).
- [ ] No unrelated refactors or out-of-scope changes.
- [ ] Out-of-scope findings registered in `agents/docs/debt.md`.
- [ ] Durable docs updated (API, DB files, design, decisions) as needed.
- [ ] Durable decisions recorded in `agents/docs/decisions.md` with user approval, or deliberately left task-local.

### Validation (still `current`)
- [ ] Targeted tests:
- [ ] Full test suite:
- [ ] Lint:
- [ ] Typecheck:
- [ ] Build:
- [ ] `agents/docs/dod.md` in-progress criteria checked:

### Closeout (→ `done`)
- [ ] Ask user before marking the task done.
- [ ] Distill `TASK-XXX.md` to a compact historical summary in `agents/tasks/archive/`.
- [ ] Remove the task file from `agents/tasks/current/`.

## Resume Notes
...
