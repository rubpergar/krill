# Technical Debt

Registry of bugs, issues, improvements, or incidents the agent finds while working on a task that are outside the current task's scope.

## When to Register Technical Debt

Register a finding here when it is **outside the active task's scope** and deserves future attention:

- A bug, security risk, performance problem, or incorrect behavior detected but out of scope.
- An improvement, refactor, or consolidation that is clearly valuable but the current task must not tackle.
- An incident or deferred decision that must not be forgotten.

Do not register as debt: personal preferences, noise, style/naming without impact, or findings already covered by an existing task or an ADR. Debt is for what the current task will not solve but must not be lost.

Action rule: when the agent finds something relevant but out of scope, it must register it here instead of modifying it without permission. The user reviews the log periodically and decides whether to create a formal task.

## Minimum Information per Entry

Each entry must include, at minimum:
- **Title**: `DBT-XXX: <short title>`.
- **Date**: when it was registered.
- **Status**: `open` (pending user review) or `dismissed` (the user decided not to address it).
- **Risk**: `low | medium | high`.
- **Impact**: `low | medium | high`.
- **Suggested priority**: `low | medium | high | critical`.
- **Evidence**: related file(s), line(s), or link.
- **Description**: explanation of the problem.
- **Recommendation**: what to do to resolve it.

## How to Keep It Updated

- Review the log with the user periodically (e.g. during task closeout) and confirm whether each entry is still accurate.
- When a debt item is resolved, change it to `dismissed` or remove it from the log as appropriate, and briefly note the resolution.
- When the user decides to address it as a formal task, reference the `DBT-XXX` in the task plan and close the entry.
- Do not accumulate un-reviewed debt: the log must reflect live debt, not an indefinite historical file.

## Statuses
- `open`: pending user review.
- `dismissed`: the user decided not to address it.

## Format

```md
## DBT-XXX: Short title
Date: YYYY-MM-DD
Status: open | dismissed
Risk: low | medium | high
Impact: low | medium | high
Suggested priority: low | medium | high | critical
Evidence: Related file(s), line(s), or link.
Description: Explanation of the problem.
Recommendation: What to do to resolve it.
```

## Log
