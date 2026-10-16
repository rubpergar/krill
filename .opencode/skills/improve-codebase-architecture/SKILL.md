---
name: improve-codebase-architecture
description: Survey architectural friction, present refactor candidates as a visual HTML report, then explore the one you choose.
metadata:
  opencode/autoinvoke: "false"
---

# Improve Codebase Architecture

Find refactors that hide meaningful complexity behind smaller interfaces. The aim is locality, leverage, testability, and easier codebase navigation.

This skill owns the survey and candidate exploration. `code-design` owns design discipline and vocabulary; `agents/docs/task-lifecycle.md` owns subsequent planning and implementation. This is an optional maintenance operation, not a lifecycle gate.

## Scope and context

- Treat the repository as read-only except for the HTML report in the project root (see step 2); do not edit code, tests, configuration, durable docs, or the task file.
- No task record is required. If `agents/task/TASK.md` exists, read it for ongoing scope and constraints, without resuming, replacing, or changing it.
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

Write `ARCHITECTURE-REVIEW.html` in the root of the currently open project. Do not use a temporary directory or another filename.

Identify the active OpenCode project/workspace root. In a Git project, `git rev-parse --show-toplevel` can help identify it, but use the root of the opened project if it is a subproject within a larger repository.

If the project root is missing, there are multiple plausible roots, or you cannot confidently determine the correct destination, ask the user through OpenCode's `question` tool where to create `ARCHITECTURE-REVIEW.html`. Wait for the answer before writing; do not guess or fall back to a temporary directory.

If `ARCHITECTURE-REVIEW.html` already exists, read it first. Replace it when it is clearly an earlier report. If its purpose or ownership is unclear, ask before overwriting it.

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

End with the selected candidate, affected paths, expected benefit, preserved contracts, risks, validation approach, and unresolved questions. Suggest `/plan` when the user wants to proceed. Selecting a candidate does not approve implementation or change the task record; let `/plan` enforce the lifecycle contract rather than creating a second task or an implementation checklist.
