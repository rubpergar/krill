---
name: improve-codebase-architecture
description: Survey architectural friction and deepening opportunities, produce a visual HTML report, then explore a selected candidate. Use only when the user explicitly requests an architecture survey or invokes /improve-codebase-architecture, not during routine implementation or diff review.
---

# Improve Codebase Architecture

Find refactors that hide meaningful complexity behind smaller interfaces. The aim is locality, leverage, testability, and easier codebase navigation.

This skill owns the survey and candidate exploration. `code-design` owns design discipline and vocabulary; `agents/docs/task-lifecycle.md` owns subsequent planning and implementation. This is an optional maintenance operation, not a lifecycle gate.

## Scope and context

- Work read-only in the repository. The only writable artifact is the temporary HTML report; do not edit code, tests, configuration, durable docs, debt, or the task file.
- No active task is required. If `agents/task/TASK.md` exists, read it for ongoing scope and constraints, without resuming, replacing, or changing it.
- Load `code-design` with the skill tool. Follow its deep-module guidance as well as the project's conventions.
- Read relevant accepted ADRs and domain vocabulary from the paths declared in the `AGENTS.md` Source of Truth Map. Use existing project docs when no vocabulary path is declared. Missing docs are not a blocker; do not create a glossary or an ADR directory.
- Use the project's language and established domain terms. Do not impose new architectural naming on existing contracts.

## Process

### 1. Explore

**Scope before scanning.** If the user named a module, subsystem, pain point, or upcoming change, start there and inspect its callers and dependencies only as needed. Otherwise inspect recent Git history and prioritize repeatedly changed areas. If history is unavailable or has no clear hot spots, use the source structure and call paths to choose a bounded starting area, and state that choice.

For a small scope, inspect directly. For a large or multi-area scope, use bounded exploration sub-agents with the relevant paths, constraints, and ADRs; ask for evidence and candidate summaries, not a whole-repository rewrite. Verify their claims before including them.

Look for concrete friction:

- One concept requires navigating many shallow modules.
- An interface exposes nearly as much complexity as its implementation.
- Extracted functions are tested in isolation while real failures live in their coordination.
- Knowledge or invariants leak across seams, forcing callers to duplicate coordination.
- Current interfaces make meaningful behavior difficult to test.

Apply the deletion test from `code-design`. Trace representative callers and tests to establish where complexity would go after a refactor. Missing tests, file size, or a disliked pattern alone do not establish an architectural defect.

Keep candidates tied to observed friction and likely changes, not hypothetical variation. Account for migration cost, public contracts, and existing validation. Do not invent candidates to fill a quota; a clean survey may find no justified improvements.

### 2. Present visual candidates

Read [HTML-REPORT.md](HTML-REPORT.md) for the report format. Present the problem and direction of each refactor; defer detailed interface design until the user picks a candidate.

Resolve the actual OS temporary directory (`TEMP`/`TMP` on Windows, `TMPDIR` or the system temp directory elsewhere). Write `architecture-review-<timestamp>.html` there using a unique filename, outside the repository. Request access if the runtime requires it; never fall back to writing the report into the project. If temporary output is unavailable, explain the limitation and return the report in the conversation.

Inspect the rendered report when a preview tool is available; otherwise state that rendering was not verified. Open the file with the platform's launcher (`Start-Process` on Windows, `open` on macOS, `xdg-open` on Linux) when available, and always report its absolute path. If opening fails, return the path rather than installing tools or starting a server.

If there are no justified candidates, report that explicitly and stop. If the user asked for the report only, stop after presenting it. Otherwise ask which candidate they want to explore, using the question interface when available, and wait. Do not start interviewing about a candidate the user has not selected.

### 3. Explore the selected candidate

Ask one high-leverage question at a time, offering concise options and a recommendation where useful. Find repository facts yourself; ask the user for decisions and constraints, not facts that inspection can establish.

Resolve the questions that matter to this refactor:

- Which upcoming changes or current maintenance problems should it make easier?
- What behavior, ordering guarantees, error handling, and public contracts must survive?
- What complexity belongs behind the interface, and which real dependencies vary at the seam?
- Which callers and tests change, which stay intact, and how will preserved behavior be verified?
- What migration, compatibility, or operational risks could outweigh the benefit?

Compare alternative interface shapes only when a real trade-off warrants it. Stop when the candidate is sufficiently defined for planning, or the user rejects or defers it; do not exhaust unrelated design branches.

Keep resolved choices and remaining questions in a concise proposal summary in the conversation, referencing the report. Proposed vocabulary changes remain proposals. If a durable rejection reason should prevent repeated suggestions, offer to carry it into planning under `agents/docs/decisions.md`; do not write an ADR here.

End with the selected candidate, affected paths, expected benefit, preserved contracts, risks, validation approach, and unresolved questions. Suggest `/plan` when the user wants to proceed. Selecting a candidate does not approve implementation or change the active task; let `/plan` enforce the lifecycle contract rather than creating a second task or an implementation checklist.
