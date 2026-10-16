---
description: Review the task's diff for spec compliance, standards, and concrete improvements
---

# /review

Review the complete task diff (its commits and working-tree changes) against its plan, the repository standards, and design quality. Find real defects and concrete improvements, report findings, and apply the lifecycle gate. Do not invoke `/implement`, fix findings, or take another follow-up action without a new explicit user instruction. Additional user context: `$ARGUMENTS`

## Input and validation

- Read `agents/docs/task-lifecycle.md` and the task record (`agents/task/TASK.md`), and validate it as that contract defines. If there is no valid task record, stop and suggest `/plan`; if the phase is `blocked`, report the blocker and stop.
- Determine the review range: by default, the current task's own changes (its commits and working-tree changes) against the point where the task started, scoped to the files the task touched. If `$ARGUMENTS` names concrete branches, commits, or another fixed point, use those instead. Treat the rest of `$ARGUMENTS` as free context. One option is recognized: `--no-checks` disables every check — do not run tests, lint, typecheck, or build; review the code itself and state in `Validation` that the checks were skipped by `--no-checks`.

## Method

- Load the `code-review` skill with the skill tool and follow it: three independent axes (Spec, Standards, Improvement), each in its own sub-agent.
- Load the `code-design` skill for design-discipline checks.

## Task-specific rules

- Plan and criteria source: the task record plus the relevant source-of-truth documents declared in the `AGENTS.md` Source of Truth Map (for example `agents/docs/decisions.md` and `agents/docs/dod.md`, and the API or DB files only when the map still lists them) and accepted ADRs. Judge test quality and validity with `.opencode/skills/tdd/`; use `agents/docs/testing.md` only for project test logistics.
- Use the review skill for analysis and record the result according to `agents/docs/task-lifecycle.md`. Do not modify product code or change task state outside the fields and transitions allowed by that contract.
- Keep a technical, specific, and constructive tone; report findings first.

## Output

The first line must be exactly `Findings`. Then:

```text
Findings
Summary: Give a concise overall result, including the count and severity of findings and whether user input is needed. Then report the detailed findings and review axes below.
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

After the report and permitted task-state updates are complete, end the invocation and wait for the user's next instruction.

Do not publish anything, modify product code, commit, or push.
