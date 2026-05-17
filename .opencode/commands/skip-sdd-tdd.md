---
description: Quick implementation without SDD/TDD for trivial changes
---

Implement a change directly, skipping the full SDD workflow (backlog, plan, checklist, TDD).

Requested change: `$ARGUMENTS`

Rules:
- This mode only applies to changes that meet ALL eligibility criteria below.
- You must briefly explain why the change qualifies before implementing.
- Implement the minimal change needed - no extra refactors or improvements.
- If during execution the change turns out to be ambiguous, risky, or has behavior impact, STOP and explain that it should follow the normal SDD flow.
- If `$ARGUMENTS` is empty, ask what the user wants to change.
- At the end, state that FAST mode was used and what minimum validation was performed (e.g. file was written, syntax is valid).

Eligibility - the change MUST meet ALL conditions:
- Small and reversible
- No functional behavior impact
- Low risk
- Does NOT touch API, DB, auth, payments, or security

Allowed changes:
- Typo fixes in documentation
- Non-functional copy changes
- Comment adjustments
- Non-behavioral formatting
- Minor internal documentation updates

NOT allowed:
- Behavior changes
- Functional bugfixes
- Risky refactors
- API, DB, auth, payment, or security changes
- UI changes that affect accessibility or behavior

Flow:
1. Read `$ARGUMENTS` and determine if the change qualifies for FAST mode.
2. If it qualifies, explain why and implement directly.
3. If it does not qualify, explain why and suggest using the normal SDD flow.
4. If ambiguity or risk appears mid-implementation, stop and escalate to SDD.
5. When done, report what FAST mode was used for and what validation was performed.
