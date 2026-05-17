<p align="center">
  <img width="180" height="180" alt="Krill" src="https://github.com/user-attachments/assets/343504e5-96bf-4d0d-adb1-a3c732ce0c17" />
</p>

<h1 align="center">Krill</h1>

<p align="center">
  Spec-driven agent workflow template for structured, test-first software development.
</p>

---

# Agent Project Template

Reusable starter for projects that want an agent to work with spec-driven development (SDD), test-driven development (TDD), scoped source-of-truth docs, and resumable task files.

## Structure

| Path | Purpose |
|---|---|
| `AGENTS.md` | Operating rules, routing, SDD workflow, boundaries, commands |
| `agents/task/` | Backlog, task plan template, checklist template, archive |
| `agents/docs/` | Durable project docs: API, design, testing, DoD, decisions |
| `agents/db/` | Schema and domain notes when persistent data exists |
| `agents/skills/` | Optional procedures for TDD, UI/UX, UI review, and SEO |

## Setup

1. Copy the template into a project.
2. Fill `AGENTS.md`: product, stack, commands, security boundaries, project structure.
3. Fill `agents/docs/testing.md` with real validation commands before product implementation.
4. Mark unused source-of-truth docs as `Not applicable` instead of leaving misleading examples.
5. Add exactly one task under `## Current` in `agents/task/backlog.md` when implementation should begin.
6. Create and approve `agents/task/TASK-XXX-plan.md`.
7. Create `agents/task/TASK-XXX-checklist.md`.
8. Read and apply the TDD skill for implementation, validate against `agents/docs/DoD.md`, then ask before backlog closeout/archive moves.

## Skills Installation & Provenance

Skills in `agents/skills/` come from upstream sources declared in `skills-lock.json`. Some skills (e.g. `context7-mcp`, `find-skills`) are installed as local copies from GitHub and their lock source paths may reference the installing user's home directory (`~/.agents/skills/...`). If you clone this repository on a new machine:

1. Ensure your agent runtime (e.g. OpenCode) has the required MCP tools for each skill.
2. Re-run the skill installer or verify that skill files exist in the expected paths.
3. Update `agents/skills/README.md` lock source paths to match your setup if they differ.
4. Do not commit local credential files (API keys, `.env`, tokens) to this repository.

For full SDD workflow, operating rules, commands, and source-of-truth governance, see [`AGENTS.md`](AGENTS.md).
