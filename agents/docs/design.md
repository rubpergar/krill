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

Reusable UI/design source of truth. Delete this file if the project has no UI.

Document only durable, reusable UI decisions here. Do not document one-off screen details.

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

Explain palette, token usage rules, and dark mode strategy.

- Dark mode strategy:
- Known exceptions:

## Typography

Describe hierarchy, font stack, and usage rules.

| Token | Font | Size | Weight | Line height | Usage |
|---|---|---|---|---|---|
| `body` | | | | | Default body |
| `heading` | | | | | Headings |

## Layout

Define breakpoints, grid, and responsive behavior.

- Layout strategy:
- Max content width:
- Breakpoints: sm / md / lg / xl

## Components

### Interactive States

| State | Visual rule | Accessibility rule |
|---|---|---|
| Default | | |
| Hover | | Do not rely on hover-only affordances |
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
- **Do not update** for normal use of existing components or one-off visual details.

### Known Exceptions

| Exception | Reason | Scope |
|---|---|---|
| | | |
