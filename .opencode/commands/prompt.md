---
description: Convert a rough request into an optimized prompt and execute it
---

Take the user's raw request, improve it into a stronger prompt, then execute that optimized prompt.

Raw request: `$ARGUMENTS`

If `$ARGUMENTS` is empty, ask the user for the raw task they want to improve and execute.

Read `AGENTS.md` for repository rules. Load the `prompt-optimization` skill with the skill tool and follow it in optimize-and-execute mode.
