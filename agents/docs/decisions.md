# Architecture Decision Records

ADR log for durable decisions that should guide future work.

Before planning product work, read relevant accepted ADRs and do not contradict them silently.

## When to Update decisions.md

Record an ADR only when the decision is **durable** and has **future impact**. An ADR is appropriate when it meets at least one of these criteria:

- It is **hard to revert** or costly to change later (architecture, contracts, persistence, security).
- It is **surprising without context**: another engineer or agent would not infer the reason from the code.
- It is the result of a **real trade-off** between valid options (not an obvious choice).
- It will **guide future work** repeatedly.

Do not record as an ADR: one-off task choices, temporary workarounds, task-local assumptions, obvious implementation details, or decisions better represented in code, tests, or specs. Those live in the task plan/Execution.

Process: before adding or changing an ADR, ask the user for approval and summarize the title, context, decision, consequences, and future value. ADRs are only marked `accepted` after explicit user approval. If new work conflicts with an accepted ADR, explain the conflict and ask whether to keep, rewrite, or update it.

## Minimum Information per ADR

Every ADR must include, at minimum:

- **Title**: `ADR-XXX: <short title>`.
- **Date**: when it was recorded.
- **Status**: `accepted` (approved) or `rejected` (declined; keep only if remembering the rejection prevents repeated debate).
- **Context**: what uncertainty, constraint, or trade-off forced the decision and which options mattered.
- **Decision**: the concrete rule future work should follow, specific enough for another agent to apply it.
- **Consequences**: benefits, costs, constraints, or follow-up work it creates.

Record only decisions with future impact. Keep one-off choices, temporary workarounds, task-local assumptions, and code details in the task plan/checklist.

## Format

```md
## ADR-000: Short title
Date: YYYY-MM-DD
Status: accepted | rejected
Context: What recurring uncertainty, constraint, or tradeoff forced the decision? What options mattered?
Decision: What rule should future work follow? Be specific enough that another agent can apply it.
Consequences: What benefits, costs, constraints, or follow-up work does this create?
```

## Log
