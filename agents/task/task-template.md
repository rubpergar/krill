---
title: Short task title
created: YYYY-MM-DD
---

# Short task title

Instantiate this template as `agents/task/TASK.md` when planning starts. Implementation starts from the task file, following `agents/docs/task-lifecycle.md`. Add `approved_at` to the frontmatter only after explicit user approval.

## Plan

The Plan is the approved contract. Keep it stable after approval; see `agents/docs/task-lifecycle.md` for changes.

### Summary
What will change and why? Keep it short.

### Scope
**In:**
- ...

**Out (explicitly excluded):**
- ...

**Documentation impact:** Name the durable documents and sections whose contracts change. Routine status stays in the task file.

### Current Behavior
Include this section only when there is existing behavior to change.

...

### Acceptance Criteria
Number each criterion (AC-1, AC-2...) for reference from `Converge` and review. Put non-obvious edge cases, error paths, and boundaries here as criteria.

- AC-1: ...
- AC-2: ...

### Assumptions and Risks
Use `Assumption:` for facts the plan depends on and `Risk:` for what could go wrong; decisions and exclusions belong in `Decisions` and `Scope`.

- Assumption: ... (impact if false)
- Risk: ... (mitigation)

### Database Impact
Use `Not applicable` when the task has no database impact. Paths are in the `AGENTS.md` Source of Truth Map; SQL and rollback notes belong to the DB change log. This section is the plan: actual commands and results belong in `### Validation`, and `Required doc updates` lists the durable docs affected by the DB change.

- Change and affected data:
- Forward migration:
- Rollback / irreversibility:
- Compatibility with persisted data:
- Operational risks:
- Validation:
- Backup/recovery:
- Required doc updates:

### Open Questions
Use `None` when there are no unresolved questions. Only list items that block approval; resolved decisions belong in `Summary` or `Decisions`.

- None.

### Decisions
Record only pointers and task-local choices. ADR content and approval status belong in `agents/docs/decisions.md`; record the approval event in the `Checkpoint Log`.

- ADRs read:
- ADR required:
- Task-local decisions:

### Test Strategy
Include this section when the task has tests or a TDD exception. Record the task-specific seams and exceptions here; the methodology is in `.opencode/skills/tdd/SKILL.md`.

- Seams under test (confirmed with the user):
- Approved TDD exceptions (with approval reference):

## Execution

This section is mutable execution state.

### Resume State
- Phase: `planning`
- Blockers: None
- Last validation: Not run (details in `Validation`)
- Last checkpoint: ... (details in `Checkpoint Log`)
- Scope changes: None (details in `Checkpoint Log`)
- Updated: YYYY-MM-DDTHH:MM:SSZ

### TDD Ledger
The ledger is the single progress pointer and the durable RED/GREEN evidence. Track each behavior or acceptance criterion with a short label; the full criterion stays in the Plan. Preserve completed items and append evidence when resuming. An approved exception uses a single item with its approval reference.

- [ ] AC-1 / Behavior:
  - [ ] RED: pending; Evidence (command/result):
  - [ ] GREEN: pending; Evidence (command/result):

### Checkpoint Log
Append only approvals, interruptions, blockers, scope changes, and important validation results. RED/GREEN evidence stays in the `TDD Ledger`.

- YYYY-MM-DDTHH:MM:SSZ | event | result | next step at that time

### Converge
Map each numbered acceptance criterion to concrete evidence before integration. The DoD owns the completion criteria; this table records their evidence.

| Acceptance criterion | Evidence |
|---|---|
| AC-1 | ... |

- Scope deviations / out-of-scope findings: none | ...
- Durable docs changed: none | <doc>: <section> — <contract changed>
- DoD checked: pass / gaps

### Validation
Record the commands defined in `agents/docs/testing.md` that were run. Record skipped checks with their reason and residual risk.

| Check | Command | Result | Notes |
|---|---|---|---|
| ... | ... | ... | ... |

- Skipped: reason + residual risk

### Review Findings
Record findings reported by `/review`; lifecycle gates and dispositions are defined in `agents/docs/task-lifecycle.md`.

| ID | Finding | Severity | Disposition | Evidence or user instruction |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |
