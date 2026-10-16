---
description: Resume or execute the approved task file with persistent TDD state
---

Execute the approved task file `agents/task/TASK.md` following the SDD/TDD workflow.

Read `agents/docs/task-lifecycle.md` first. It owns the task file, phases, gates, resumption, and how review findings are dispositioned; do not restate or override it. Read the task file, the relevant source-of-truth documents from the `AGENTS.md` map, and `agents/docs/testing.md`. Load the `tdd` skill and follow its approved exception process; load `code-design` when writing or reviewing production code.

## Flow

1. Validate the task and resume from its saved state according to `agents/docs/task-lifecycle.md`; if there is no valid task, suggest `/plan`.
2. Execute the approved plan using the `tdd` skill and persist progress as the lifecycle contract defines.
3. Run configured validation commands from `agents/docs/testing.md` and satisfy the Converge evidence criteria in `agents/docs/dod.md`. When the lifecycle gate is met, record `phase: reviewing` and report that `/review` is the next step. Do not invoke `/review` or perform an independent review in this invocation.
4. Stop after reporting the phase and next action; do not invoke another command. Do not delete the task.
