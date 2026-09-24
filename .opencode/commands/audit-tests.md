---
description: Audit test quality and functional coverage, then fill only confirmed gaps
---

Audit the project test surface and report quality and coverage gaps.

Optional scope: `$ARGUMENTS`

If `$ARGUMENTS` is provided, limit the audit to the specified module, package, directory, test target, or functional area. Otherwise inspect the full test surface.

Read `agents/docs/testing.md` first. It is the source of truth for commands, locations, fixtures, coverage configuration, the Valid Test Criteria, and the Functional Coverage rule.

Read `AGENTS.md` and the active task file matching `TASK-*.md` in `agents/tasks/current/` when one exists. Validate it as `agents/docs/task-lifecycle.md` defines; stop on malformed or ambiguous state instead of altering it silently.

Load the `test-audit` skill with the skill tool and follow it. Default to audit only; write tests only for the gaps the user confirms.
