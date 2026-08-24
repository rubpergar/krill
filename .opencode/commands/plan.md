---
description: Create or refine the active task plan from conversation context
---

Create or refine `agents/tasks/current/TASK-XXX.md` (active task) or `agents/tasks/todo/TASK-XXX.md` (pending) for the active task using the planning discussion already developed in the conversation.

Rules:
- Identify the active task: the single file in `agents/tasks/current/`, or the pending task selected from `agents/tasks/todo/`.
- If `agents/tasks/current/` has zero or multiple tasks, stop and ask the user to select or create one.
- Extract the task ID (TASK-XXX) from the task file name.
- Read `agents/tasks/template.md` to understand the required structure (frontmatter + Plan + Execution).
- Read relevant accepted ADRs from `agents/docs/decisions.md` before finalizing behavior or implementation choices.
- Do not assume a special agent mode is required. This command must work correctly in the normal working mode.
- Before asking questions, inspect the smallest useful set of files and project context needed to understand the task.
- If the user references multiple repositories, large codebases, or supporting documents, inspect them first and parallelize exploration when useful.
- Use the conversation context (planning discussion, /prompt-run output, user clarifications) to fill every section of the Plan portion of the template.
- Do not invent requirements, APIs, DB structures, or technical facts that were not discussed or confirmed.
- If critical information is missing from the conversation, list it under `## Open Questions` instead of guessing.
- Keep the task status as `todo` while planning is in progress. When no blocking open questions remain, ask the user whether the plan is ready for approval. Only after an explicit affirmative answer may this command change the status to `current` (start) or mark it approved.
- Create the task early and refine it iteratively. Do not wait until every question is answered before writing the first draft.
- If a task file already exists, update it with any new discussion points instead of overwriting blindly.
- Prefer asking one high-leverage planning question at a time.
- Prefer interface-based option questions over free-form chat whenever there are clear alternatives.
- For each question, present concise options, put the recommended option first, explain the tradeoff briefly, and leave room for a custom answer when needed.
- After each planning answer, update the draft plan immediately so the file stays in sync with the conversation.
- If the task affects the database, fill the `### Database Impact` section with the approach discussed.
- Follow `AGENTS.md` for the canonical planning workflow and planning-question behavior.

Flow:
1. Confirm exactly one active task in `agents/tasks/current/`, or select one from `agents/tasks/todo/`.
2. Read `agents/tasks/template.md` for the structure.
3. Read `agents/docs/decisions.md` and the relevant source-of-truth files and referenced context for the active task.
4. Synthesize the available context into the current best draft plan.
5. Create or update the task file (`agents/tasks/current/TASK-XXX.md` or `agents/tasks/todo/TASK-XXX.md`) with status `todo`.
6. Ask the next highest-value unresolved question.
7. After each user answer, update the draft plan and continue until the user confirms the plan is complete.
8. When pausing, show the current plan progress and the remaining open questions that block approval.
9. When no blocking questions remain, summarize the plan and ask whether the user wants to approve it for implementation.
10. If the user explicitly approves, move the task to `agents/tasks/current/` (or set status accordingly) and record the approval. Otherwise leave it as `todo` and continue planning or report the remaining refinements.
