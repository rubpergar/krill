---
version: alpha
name: myFinancePal
colors:
  background: "#F5F7FB"
  surface: "#FFFFFF"
  foreground: "#172033"
  muted: "#64748B"
  border: "#D9E0EA"
  primary: "#2563EB"
  secondary: "#0F766E"
  success: "#15803D"
  warning: "#B45309"
  danger: "#B91C1C"
  focus: "#1D4ED8"
typography:
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
  heading:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
rounded:
  sm: "0.375rem"
  md: "0.625rem"
  lg: "0.875rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
components:
  button:
    backgroundColor: "#2563EB"
    textColor: "#FFFFFF"
    rounded: "0.625rem"
  input:
    backgroundColor: "#FFFFFF"
    borderColor: "#D9E0EA"
    rounded: "0.625rem"
---

# Design System

Reusable UI/design source of truth. Delete this file if the project has no UI.

Document only durable, reusable UI decisions here. Do not document one-off screen details.

The YAML block above is the DESIGN.md front matter; keep it first in the file. Validation is optional: `npx -p @google/design.md designmd lint agents/docs/design.md` (requires Node.js; valid only when this file uses DESIGN.md front matter).

## Overview

- **UI type:** Desktop dashboard for personal finance tracking
- **Audience:** One local user
- **Tone:** Calm, clear, and practical
- **Density:** Moderate; prioritize scanning totals and recent movements
- **Accessibility target:** WCAG 2.2 AA (default)
- **Dark mode:** not applicable for the MVP

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
