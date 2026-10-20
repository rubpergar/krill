<p align="center">
  <img src="https://github.com/user-attachments/assets/4b3644b1-5931-43a9-ab00-17b852a014d1" alt="Krill" width="72%" />
</p>

<p align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/Krill-agent_skeleton-0A2540?style=flat-square&label=%F0%9F%A6%90" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-3B82F6?style=flat-square" />
</p>

An agent skeleton for disciplined development with [OpenCode](https://opencode.ai): planned tasks, test-driven implementation, and documentation as the source of truth.

## What it is

Krill is an agent skeleton for OpenCode. Drop its agent files into a project to give the agent clear rules, a traceable task lifecycle, and validation gates before touching product code.

It ships in `skeleton` mode: no product code and no stack assumptions. You adopt it into a project through bootstrap, which fills the source-of-truth docs and switches the repository to `project` mode.

## How to use it

1. Download the repository as a ZIP (on GitHub: Code then Download ZIP) and extract it.
2. Copy these into the root of your project:
   - `AGENTS.md`
   - `agents/`
   - `.opencode/`

   Do not copy Krill's `.git` or `README.md`, or overwrite the host project's `LICENSE`. Preserve Krill's MIT notice by including its `LICENSE` separately or in the project's third-party notices.
3. Open the project in OpenCode and run `/bootstrap`. For a new project with no code yet, follow the incremental path in [`.opencode/skills/bootstrap/BOOTSTRAP.md`](.opencode/skills/bootstrap/BOOTSTRAP.md).
4. For work that needs the full lifecycle, plan, implement, review, and integrate.

```mermaid
flowchart LR
    P["/plan"] --> I["/implement"] --> R["/review"]
```

## Commands

| Command | Purpose |
|---|---|
| `/bootstrap` | Adopt the skeleton into an existing project and switch to project mode |
| `/plan` | Create or refine the task plan |
| `/implement` | Execute or resume the approved task with persistent TDD state |
| `/review` | Review the task diff: spec, standards, and concrete improvements |
| `/audit-tests` | Audit test quality and functional coverage |
| `/improve-codebase-architecture` | Survey architectural friction, compare visual refactor candidates, and explore one before planning |
| `/commit` | Review hunks, group related changes into semantic commits, and push |
| `/prompt` | Convert a rough request into an optimized prompt and execute it |

## What's inside

- `AGENTS.md`: mode, invariants, boundaries, and the source-of-truth map.
- `.opencode/commands/`: user-invoked orchestrators (the table above).
- `.opencode/skills/`: process skills (TDD, design, code review, test audit, architecture survey, commit, bootstrap, prompt). Model-invoked unless the frontmatter makes them command-only (`opencode/autoinvoke: "false"`). Domain skills are added per project.
- `.opencode/agents/`: custom agents; `krill-maintainer.md` maintains Krill itself.
- `agents/docs/`: durable contracts (task lifecycle, DoD, testing, decisions, dependency policy, API, design).
- `agents/task/`: the single SDD task record `TASK.md` and its template.
- `agents/db/`: schema, change log, and domain fallbacks.

## Requirements

[OpenCode](https://opencode.ai)

## License

MIT. See [`LICENSE`](LICENSE).
