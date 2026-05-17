<p align="center">
  <img width="180" height="180" alt="krill-logo" src="https://github.com/user-attachments/assets/343504e5-96bf-4d0d-adb1-a3c732ce0c17" />
</p>

<h1 align="center">krill</h1>

<p align="center">
    Agent skeleton with spec-driven development (SDD) workflow, custom commands, and extensible skill system.
</p>

---

This repository is in **skeleton mode** — no product code has been implemented yet. It is ready to be adopted into an existing project or initialized for a new one via the bootstrap workflow.

## Description

A structured agent workspace for [OpenCode](https://opencode.ai) that enforces disciplined software engineering practices: spec-first planning, test-driven development, source-of-truth documentation governance, and resumable task tracking. Designed to be cloned and adapted, not forked.

## Prerequisites

- **OpenCode** &mdash; this skeleton is designed for OpenCode but the conventions and workflows could be adapted to other agent workspaces.
- **Context7 MCP** &mdash; required for the `context7-mcp` skill (library documentation queries). Configure it in your OpenCode settings (`opencode.json` or global config). See [Context7 MCP docs](https://opencode.ai) for setup instructions.

## Custom Commands

| Command | Description |
|---|---|
| [`bootstrap`](.opencode/commands/bootstrap.md) | Adopt the agent skeleton into an existing project; configure source-of-truth docs and transition to project mode |
| [`commit`](.opencode/commands/commit.md) | Group changes into semantic commits and push |
| [`fast`](.opencode/commands/skip-sdd-tdd.md) | Quick implementation of trivial, non-behavioral changes (bypasses SDD/TDD) |
| [`prompt`](.opencode/commands/prompt.md) | Convert a rough request into an optimized prompt (output only, no execution) |
| [`prompt-run`](.opencode/commands/prompt-run.md) | Convert a rough request into an optimized prompt and execute it |
| [`readme`](.opencode/commands/readme.md) | Generate or overwrite the project README.md |

## Installation

Clone the repository and place it at the root of your project workspace:

```bash
git clone <repo-url> krill
```

If you are adopting this skeleton for an **existing project**, run the bootstrap command:

```
/bootstrap
```

If you are starting a **new project**, follow the incremental initialization path in `agents/docs/bootstrap.md`.

## Usage

1. Ensure your project is in **project mode** (see bootstrap).
2. Add a single task under `## Current` in `agents/task/backlog.md`.
3. Create and approve a task plan (`agents/task/TASK-XXX-plan.md`).
4. Create a checklist (`agents/task/TASK-XXX-checklist.md`).
5. Implement following test-driven development.
6. Validate against the Definition of Done (`agents/docs/DoD.md`).

Refer to `AGENTS.md` for the full SDD workflow, operating rules, and source-of-truth governance.

## Directory Structure

```
krill/
├── .opencode/
│   └── commands/         # Custom OpenCode commands (bootstrap, commit, fast, prompt, readme)
├── AGENTS.md             # Operating rules, SDD workflow, boundaries, commands
├── README.md             # This file
└── skills-lock.json      # Skill provenance and integrity hashes
```

> The `agents/` directory (task tracking, source-of-truth docs, DB schema, skills) is excluded from this overview. See `AGENTS.md` for its structure.

## Contributing

This is a private agent skeleton. Contributions are not expected in its current state. If you have suggestions, open an issue in the upstream repository.

## License

MIT &mdash; see [LICENSE](LICENSE) for details.
