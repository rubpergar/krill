---
version: alpha
name:
colors:
  background:
  surface:
  foreground:
  muted:
  border:
  primary:
  secondary:
  success:
  warning:
  danger:
  focus:
typography:
  body:
    fontFamily:
    fontSize:
  heading:
    fontFamily:
    fontSize:
rounded:
  sm:
  md:
  lg:
spacing:
  xs:
  sm:
  md:
  lg:
components:
  button:
    backgroundColor:
    textColor:
    rounded:
  input:
    backgroundColor:
    borderColor:
    rounded:
---

# Design System

Reusable UI/design source of truth. Mark as `Not applicable` if the project has no UI; the bootstrap transition deletes this file when it is not used.

Document durable, reusable UI decisions here; one-off screen details stay in the task file.

The YAML block above is the DESIGN.md front matter; keep it first in the file. Validation is optional: `npx -p @google/design.md designmd lint agents/docs/design.md` (requires Node.js; valid only when this file uses DESIGN.md front matter).

## Overview

- **UI type:**
- **Audience:**
- **Tone:**
- **Density:**
- **Accessibility target:** WCAG 2.2 AA (default)
- **Dark mode:** supported / planned / not applicable

### Visual Principles

List 3-6 principles guiding reusable UI decisions.

| Principle | Meaning | Applies to |
|---|---|---|
| | | |

## Colors

Record token names, usage rules, and dark mode strategy. Token values live in the frontmatter and implementation.

- Dark mode strategy:

## Typography

Describe hierarchy, font stack, and usage rules. Token values live in the frontmatter and implementation.

## Layout

Define breakpoints, grid, and responsive behavior.

- Layout strategy:
- Max content width:
- Breakpoints: sm / md / lg / xl

## Components

Token mappings live in the frontmatter; this section records variants, states, and usage rules.

### Interactive States

| State | Visual rule | Accessibility rule |
|---|---|---|
| Default | | |
| Hover | | Every action remains available without hover |
| Focus | | Must be visible for keyboard users |
| Disabled | | Must communicate unavailable state |
| Error | | Must include text, not color alone |

### Component Catalog

| Component | Variants | States | Notes |
|---|---|---|---|
| Button | | | |
| Input | | | |
| Card | | | |
| Modal | | | |

## Do's and Don'ts

- **Update** when a reusable token, component variant, layout rule, or accessibility rule changes.
- This file records reusable decisions; normal use and one-off visual details stay in the task file.

### Known Exceptions

Record design exceptions here; testing strategy belongs in `agents/docs/testing.md` or the task record.

| Exception | Reason | Scope |
|---|---|---|
| | | |
