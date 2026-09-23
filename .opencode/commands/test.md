---
description: Auto-discover modules, analyze functional coverage, generate exhaustive tests, and validate
---

Analyze the project test surface and expand functional coverage.

Optional scope: `$ARGUMENTS`

If `$ARGUMENTS` is provided, limit the analysis to the specified module, package, directory, test target, or functional area when possible. Otherwise inspect the full project test surface.

Read `agents/docs/testing.md` first. It is the source of truth for commands, locations, fixtures, coverage configuration, and validation rules.

Read `AGENTS.md` and the active task file matching `TASK-*.md` in `agents/tasks/current/` when one exists. Validate it as `agents/docs/task-lifecycle.md` defines; stop on malformed or ambiguous state instead of altering it silently.

Load the `test-authoring` skill with the skill tool and follow its procedure.
