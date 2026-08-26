# Skills Provenance

This directory contains optional agent skills used by the skeleton. Skills are loaded only when their trigger matches the task.

The canonical skills lock file is `skills-lock.json` in the repository root. It is the technical install record: it stores the upstream source, source path, and computed hash for each active skill. Keep it unless the skill installation mechanism is replaced, because this README is a human-facing license/provenance summary rather than a lock file.

## License Policy
- Keep each skill's original license and attribution files with the skill.
- Before modifying a skill, check its front matter, local `LICENSE`/`NOTICE` files, this README, and the root `skills-lock.json`.
- Internal company adaptations are allowed when the upstream license permits modification, but keep attribution and mark substantial changes.
- Do not redistribute, publish, sell, or deliver this skeleton externally until all included skill licenses and notices have been reviewed.
- If a skill has no local license file but its upstream repository license is known, preserve the upstream reference here and consider copying the license file into the skill directory.
- This file is not legal advice; it is a working checklist so the agent does not assume permissions that are not present or recorded.

## Modification Notes
For substantial edits to a third-party skill, add a short note near the top of the modified skill:

```md
## Internal Modifications
Modified by: <company/project>
Date: YYYY-MM-DD
Purpose: Adapted for internal development workflow.
Distribution: Internal use only unless licenses are reviewed before redistribution.
Original source/license: <source and license>
```

## Skill References

### `code-review-excellence`
- Local path: `agents/skills/code-review-excellence/`
- Lock source: `wshobson/agents`
- Lock source path: `plugins/developer-essentials/skills/code-review-excellence/SKILL.md`
- Local license signal: no local license/front matter license found.
- Upstream license checked: MIT License in `https://github.com/wshobson/agents/blob/main/LICENSE`.
- Practical status: modification and internal commercial use are allowed under MIT; add local attribution/license reference before external redistribution.

### `context7-mcp`
- Local path: `agents/skills/context7-mcp/`
- Lock source: `upstash/context7` (GitHub; see `skills-lock.json`).
- Lock source path (local copy): `<user-home-dir>/.agents/skills/context7-mcp/SKILL.md` (resolved during installation).
- Local license signal: no local license/front matter license found.
- Upstream license checked: not available from current repository metadata.
- Practical status: treat as internal-only until provenance is recorded. This skill requires Context7 MCP tooling configured in the agent runtime; do not store API keys or credentials in this repository.

### `find-skills`
- Local path: `agents/skills/find-skills/`
- Lock source: `vercel-labs/skills` (GitHub; see `skills-lock.json`).
- Lock source path (local copy): `<user-home-dir>/.agents/skills/find-skills/SKILL.md` (resolved during installation).
- Local license signal: no local license/front matter license found.
- Upstream license checked: not available from current repository metadata.
- Practical status: treat as internal-only until provenance is recorded.

### `interface-design`
- Local path: `agents/skills/interface-design/`
- Lock source: internal consolidation.
- Lock source path: `agents/skills/interface-design/SKILL.md`
- Origin: consolidates and replaces the former `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines`, and `accessibility` skills to avoid UI overlap and reduce token/resource usage.
- Source material provenance: `ui-ux-pro-max` from `nextlevelbuilder/ui-ux-pro-max-skill` (MIT), `frontend-design` from `anthropics/skills` (local Apache-2.0 license file was present before consolidation), `web-design-guidelines` from `vercel-labs/agent-skills` / `vercel-labs/web-interface-guidelines` (MIT), and `accessibility` from `addyosmani/web-quality-skills` (MIT).
- Practical status: internal skeleton guidance adapted from previously installed skills; review original license obligations before external redistribution.

### `performance`
- Local path: `agents/skills/performance/`
- Lock source: `addyosmani/web-quality-skills`
- Lock source path: `skills/performance/SKILL.md`
- Local license signal: `license: MIT` in `SKILL.md` front matter.
- Upstream license checked: MIT License in `https://github.com/addyosmani/web-quality-skills/blob/main/LICENSE`.
- Practical status: modification and internal commercial use are allowed under MIT; keep copyright/license notices when redistributing substantial portions.

### `security-review`
- Local path: `agents/skills/security-review/`
- Lock source: `getsentry/skills`
- Lock source path: `skills/security-review/SKILL.md`
- Local license signal: `license: LICENSE` in `SKILL.md` front matter.
- Local license file: `agents/skills/security-review/LICENSE`, documenting OWASP Cheat Sheet Series material under CC BY-SA 4.0.
- Upstream license checked: `getsentry/skills` repository reports Apache License 2.0; this local skill also includes OWASP-derived reference material under CC BY-SA 4.0.
- Practical status: modification and internal commercial use are allowed, but preserve attribution. If redistributing adapted OWASP-derived material, follow CC BY-SA 4.0 attribution and ShareAlike obligations; for Sentry-origin material, follow Apache-2.0 notices.

### `seo-audit`
- Local path: `agents/skills/seo-audit/`
- Lock source: `coreyhaines31/marketingskills`
- Lock source path: `skills/seo-audit/SKILL.md`
- Local license signal: no local license/front matter license found.
- Upstream license checked: MIT License in `https://github.com/coreyhaines31/marketingskills/blob/main/LICENSE`.
- Practical status: modification and internal commercial use are allowed under MIT; add local attribution/license reference before external redistribution.

### `test-driven-development`
- Local path: `agents/skills/test-driven-development/`
- Lock source: `obra/superpowers`
- Lock source path: `skills/test-driven-development/SKILL.md`
- Local license signal: no local license/front matter license found.
- Upstream license checked: MIT License in `https://github.com/obra/superpowers/blob/main/LICENSE`.
- Practical status: modification and internal commercial use are allowed under MIT; add local attribution/license reference before external redistribution.

## Retired Skill References

The former `accessibility`, `frontend-design`, `ui-ux-pro-max`, and `web-design-guidelines` skills were retired in favor of `interface-design`. Their provenance is preserved in the `interface-design` entry above.
