---
description: Group changes into semantic commits and push
---

Create semantic commits from all available changes, then push.

Load the `commit-discipline` skill with the skill tool and follow its procedure. The skill is the single source of truth for inspection, grouping, Conventional Commit format, splitting, safety, push, and the final check.

If the user provides extra context via `$ARGUMENTS`, use it to refine commit messages, but do not force text that does not accurately describe the changes.
