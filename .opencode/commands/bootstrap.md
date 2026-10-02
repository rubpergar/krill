---
description: Adopt the agent into an existing project, configure source-of-truth docs, and transition to project mode
---

Adopt this agent skeleton for an **existing project** (one with source code, manifests, config files). For new or empty projects, use the incremental initialization path described in `agents/docs/bootstrap.md`.

Read `agents/docs/bootstrap.md` for the bootstrap rules, allowed scope, readiness criteria, and the transition contract.

Load the `project-bootstrap` skill with the skill tool and follow it as the procedure.

Optional context: `$ARGUMENTS`

If `$ARGUMENTS` is provided, use it as a seed to pre-fill answers and reduce the number of questions.
