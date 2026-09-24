---
description: Review the active task's diff for spec compliance, standards, and concrete improvements
---

# /review

Review the active task's diff (branch or task commits) against its plan, the repository standards, and design quality. Find real defects and concrete improvements, decide whether the task is ready for closeout, and report findings. Additional user context: `$ARGUMENTS`

## Input and validation

- Read `agents/docs/task-lifecycle.md` first and validate the active task exactly as that contract defines: exactly one task file matching `TASK-*.md` in `agents/tasks/current/` (ignore placeholders), `approved_at` present, no frontmatter `status`, and a recognized current-task phase.
- If there is no valid active task, stop and suggest `/plan`; never reinterpret malformed state as reviewable.
- If the phase is `blocked`, report the blocker and stop; do not clear it by starting a review.
- Read the active task file (Plan and Execution).
- Determine the review range: the diff of the current branch against its merge base, or the task's commits. If `$ARGUMENTS` provides concrete branches or commits, use them. Treat the rest of `$ARGUMENTS` as free context and options such as `--deep` and `--no-checks`.

## Method

- Load the `code-review` skill with the skill tool and follow it: three independent axes (Spec, Standards, Improvement), each in its own sub-agent.
- Load the `code-design` skill for design-discipline checks.

## Task-specific rules

- Plan and criteria source: the active task file plus the relevant source-of-truth docs (`agents/docs/decisions.md`, `agents/docs/api.md`, `agents/docs/dod.md`, the DB files named in the Source of Truth Map) and accepted ADRs. Use `agents/docs/testing.md` only to judge test validity.
- Use only read-only git operations (`git diff`, `git diff --cached`, `git log`, `git status`, `git ls-files --others --exclude-standard`). Never change product code, commit, checkout other branches, or push.
- Never move, approve, close, archive, or delete the task, and never rewrite its Plan or TDD ledger. Only `Resume State` and `Checkpoint Log` may be updated.
- Do not invent requirements or acceptance criteria; if there are none, say so and limit the review to existing behavior and repository conventions.
- Refactoring and simplification belong to this stage: report them as findings, never apply them here.
- Classify severity as `blocking`, `important`, or `nit`.
- Persist the outcome: set `phase: ready_for_closeout` on a clean result only when validation, Converge, required documentation, and blockers also pass; otherwise set `phase: implementing` or `blocked` with a concrete next action. Append the review evidence to `Checkpoint Log` and update `Last validation`.
- Keep a technical, specific, and constructive tone; report findings first.

## Output

The first line must be exactly `Findings`. Then:

```text
Findings
1. [finding]
- Severity: `blocking|important|nit`
- Axis: `spec|standards|improvement`
- Reference: file:line or file
- Explanation: concrete problem, activation condition, impact, and evidence
- Minimal suggested fix: only when it helps, without imposing a broad refactor

## Spec
- covered | missing | partial | scope creep, with references
## Standards
- documented-standard breaches and baseline smells, with references
## Improvement
- concrete simplifications or alternatives, ordered by leverage, each with a recommendation

Status of previous indications
Scope deviations
Reviewed context
Validation (checks run or the reason they were not run)
Residual risks or gaps
Recommendation: `request changes`, `comment`, or `approve` (informational only)
```

If there are no problems, write explicitly `No blocking or important findings in the reviewed diff` and keep the validation and residual gaps when relevant.

Do not publish anything, modify product code, commit, or push.
