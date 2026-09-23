---
description: Rigorous review of the active task's code (branch/commit diff) contrasted against the plan and acceptance criteria
---

# /review-task

Perform a rigorous review of the active task's diff (branch or task commits) against its plan and acceptance criteria, decide whether it is ready for closeout, and report real defects with the evidence needed to fix or justify them. Additional user context: `$ARGUMENTS`

## Input and validation

- Read `agents/docs/task-lifecycle.md` first and validate the active task exactly as that contract defines: exactly one task file matching `TASK-*.md` in `agents/tasks/current/` (ignore placeholders), `approved_at` present, no frontmatter `status`, and a recognized current-task phase.
- If there is no valid active task, stop and suggest `/plan`; never reinterpret malformed state as reviewable.
- If the phase is `blocked`, report the blocker and stop; do not clear it by starting a review.
- Read `agents/tasks/current/TASK-XXX.md` (Plan + Execution).
- Determine the review range: the diff of the current branch against its merge base, or the task's commits. If `$ARGUMENTS` provides concrete branches/commits, use them.
- Treat the rest of `$ARGUMENTS` as free context and options such as `--deep` and `--no-checks`.

## Method

- Load the `code-review-excellence` skill with the skill tool and follow it as the review method.
- Load the `code-design` skill for design-discipline checks.

## Task-specific rules

- Source of truth for the plan and criteria: `agents/tasks/current/TASK-XXX.md` plus the relevant source-of-truth docs (`agents/docs/decisions.md`, `api.md`, `dod.md`, `testing.md`, DB) and the ADRs.
- Use only read-only git operations (`git diff`, `git diff --cached`, `git log`, `git status`, `git ls-files --others --exclude-standard`). Never change product code, commit, checkout other branches, or push.
- Never move, approve, close, archive, or delete the task, and never rewrite its Plan or TDD ledger. Only `Resume State` and `Checkpoint Log` may be updated.
- Do not invent requirements or acceptance criteria; if there are none, say so and limit the review to existing behavior and repository conventions.
- Check the diff for refactoring opportunities (duplication, naming, structure, dead code) and report them as findings; refactoring belongs to the review stage.
- Classify severity as `blocking`, `important`, or `nit`.
- Persist the outcome: set `phase: ready_for_closeout` on a clean result only when validation, Converge, required documentation, and blockers also pass; otherwise set `phase: implementing` or `blocked` with a concrete next action. Append the review evidence to `Checkpoint Log`.
- Keep a technical, specific, and constructive tone; report findings first.

## Output

The first line must be exactly `Findings`. Then:

```text
Findings
1. [finding]
- Severity: `blocking|important|nit`
- Reference: file:line or file
- Explanation: concrete problem, activation condition, impact, and evidence
- Minimal suggested fix: only when it helps, without imposing a broad refactor

Status of previous indications
Scope deviations
Reviewed context
Review coverage (contract and acceptance, code and execution paths, tests and wiring, documentation and deliverables)
Validation (checks run or the reason they were not run)
Residual risks or gaps
Recommendation: `request changes`, `comment`, or `approve` (informational only)
```

If there are no problems, write explicitly `No blocking or important findings in the reviewed diff` and keep the validation and residual gaps when relevant.

Do not publish anything, modify product code, commit, or push.
