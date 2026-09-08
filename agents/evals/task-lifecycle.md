# Task Lifecycle Evaluation

This is a manual regression evaluation for Krill's workflow prompts. It uses a clean fixture project because this repository contains no runtime that can execute OpenCode commands directly.

## Fixture

Create an empty fixture with the following directories (directory placeholders such as `.gitkeep` do not count as task files):

```text
agents/tasks/current/
agents/tasks/todo/
agents/tasks/archive/
```

Copy `agents/tasks/task-template.md` to `agents/tasks/todo/TASK-001.md` and fill only the plan title and one acceptance criterion. Do not create a backlog or a standalone checklist.

## Scenarios and expected evidence

| Scenario | Action | Expected result |
|---|---|---|
| New task | Run `/plan` with no current and no todo task | One new task is created in `todo/`; no implementation starts |
| Refine pending task | Run `/plan` with exactly one todo task | The plan changes; it remains in `todo/` and execution content is preserved |
| Select pending task | Run `/plan` with multiple todo tasks and no current | The question UI asks which task to refine; the agent does not guess |
| Approve task | Approve the completed plan through the question UI | The same file moves to `current/`, contains `approved_at`, and has `phase: ready_to_implement` |
| Current takes precedence | Run `/plan` with one current task and one or more todo tasks | The current task remains the only active target; todo tasks are not started |
| Start implementation | Run `/implement` | Existing execution content is preserved; phase and next action are persisted |
| Resume after interruption | Stop after a RED or GREEN checkpoint and start a fresh session | The agent reads `current/TASK-001.md`, keeps completed evidence, and continues at the first incomplete ledger item |
| Resume after REFACTOR | Stop after a REFACTOR checkpoint and start a fresh session | RED, GREEN, and REFACTOR markers and evidence remain intact; the next behavior is not repeated |
| Re-run implement | Run `/implement` again after a checkpoint | No duplicate `## Execution`, no reset checkboxes, and no lost evidence |
| Resume during validation | Stop with `phase: validating` and start a fresh session | The agent continues the pending validation item and does not restart implementation |
| Resume during review | Stop with `phase: reviewing` and start a fresh session | The agent continues review; it does not reset the ledger or silently code around findings |
| Review with findings | Run `/review-task` with a real failing criterion | Findings are recorded in review evidence; phase becomes `implementing` or `blocked` with a next action |
| Clean review | Run `/review-task` with all criteria evidenced | The task remains in `current/` and phase becomes `ready_for_closeout` |
| Ready for closeout | Record clean validation and review | Phase becomes `ready_for_closeout`; unresolved blockers prevent this phase |
| Invalid preflight | Run `/closeout` with missing evidence, docs, or `approved_at` | Approval is not requested; the task stays current with a persisted blocker |
| Closeout rejection | Decline closeout approval | Task remains in `current/` with the blocker recorded |
| Closeout ambiguity | Return no or an ambiguous answer to the approval question | Task remains current, phase stays ready for closeout, and pending approval plus next action are recorded |
| Change approved plan | Change scope while the task is current, then reject and re-approve | Rejection leaves the task blocked; explicit re-approval restores `ready_to_implement` |
| Closeout with history | Approve a non-trivial task | Durable docs are checked, a compact archive summary is written, then `current/TASK-001.md` is removed |
| Closeout without history | Approve a trivial mechanical task | No archive summary is created; the current task is removed only after checks pass |
| Closeout interruption with history | Stop after archive creation but before removal | A retry verifies the existing summary, does not overwrite it, and completes removal |
| Closeout interruption without history | Persist `Historical summary decision: omit`, then stop before removal | A retry preserves `omit`, does not recalculate or create an archive, and completes removal |
| Archive shape | Inspect a retained `archive/TASK-001.md` | It contains outcome, meaningful scope, decisions, gotchas/references, and acceptance outcome, but no execution ledger or Resume State |
| Review diff coverage | Add staged, unstaged, and untracked fixture files and run `/review-task` | Every file is classified and its full content is reviewed; untracked additions are not omitted from the matrix |
| ADR approval | Include a proposed durable ADR in the task and run closeout | Closeout requests separate ADR approval and never marks it accepted implicitly |
| Optional documentation tool | Include a library decision with and without configured Context7 | Context7 is used only when relevant and configured; it is never an unconditional lifecycle step |
| Bootstrap transition | Complete bootstrap in a clean fixture and transition to project mode | Durable findings remain; `agents/docs/bootstrap.md`, its Source of Truth Map row, and `.opencode/commands/bootstrap.md` are removed, so bootstrap cannot run again |
| Invalid multiplicity | Put two files in `current/` and invoke each lifecycle command | `/plan`, `/implement`, `/review-task`, and `/closeout` stop and ask for resolution; none guesses |
| Invalid approval | Put a task without `approved_at` in `current/` and invoke active-task commands | `/plan`, `/implement`, `/test`, `/review-task`, and `/closeout` stop instead of silently treating the move as approval |
| Invalid phase | Put an unknown phase in the active task | The command stops and records a lifecycle error; it does not infer a phase |
| Legacy status | Add `status: done` to a task fixture | The task is rejected as malformed; no command treats `done` as a lifecycle state |

## Pass criteria

- The task directory is the only lifecycle source of truth.
- No command creates or depends on `backlog.md`, `TASK-XXX-plan.md`, or `TASK-XXX-checklist.md`.
- A fresh session can resume from the task file alone without chat history.
- Completed ledger evidence survives every repeated `/implement` invocation.
- Closeout leaves no `done` task in `current/` and is safe to retry.
- Archive summaries are consulted only for explicit historical questions and never override current code, tests, or durable documentation.
