# Design System

Reusable UI/design source of truth.

Document only durable, reusable UI decisions here. Do not document one-off screen details.

Validation: `npx @google/design.md lint agents/docs/design.md` (optional, requires Node.js).

---

```yaml
---
version: alpha
name: Oceanic SaaS Logic
colors:
  background: "#f5faf8"
  surface: "#ffffff"
  foreground: "#0f172a"
  muted: "#64748b"
  border: "#e2e8f0"
  primary: "#0d9488"
  secondary: "#0f172a"
  success: "#10b981"
  warning: "#f59e0b"
  danger: "#ef4444"
  focus: "#0d9488"
typography:
  body:
    fontFamily: Inter, sans-serif
    fontSize: 14px
  heading:
    fontFamily: Inter, sans-serif
    fontSize: 24px
rounded:
  sm: 4px
  md: 8px
  lg: 12px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
components:
  button:
    backgroundColor: "#0d9488"
    textColor: "#ffffff"
    rounded: 8px
  input:
    backgroundColor: "#ffffff"
    borderColor: "#e2e8f0"
    rounded: 8px
---
```

## Overview

- **UI type:** Administrative Dashboard & Conversion Landing
- **Audience:** Sales Teams, Operations, and Business Prospects
- **Tone:** Professional, Efficient, and Technical (Developer-friendly)
- **Density:** High (Admin) / Balanced (Public)
- **Accessibility target:** WCAG 2.2 AA
- **Dark mode:** Planned

### Visual Principles

List 3-6 principles guiding reusable UI decisions.

| Principle | Meaning | Applies to |
|---|---|---|
| Technical Precision | Layouts should feel engineered and reliable, using a strict grid. | Tables, Form layouts |
| High Signal | Prioritize data clarity over decorative elements. | Admin Dashboard, Filters |
| Trust through Teal | Use the primary brand color to anchor key interactions. | CTAs, Active States |
| Scanning Ease | Use clear typography and badge systems for quick triage. | Lead Tables, Badges |

## Colors

The palette is anchored by Teal (`#0d9488`), representing clarity and growth. Surfaces use a clean, oceanic-tinted white to reduce eye strain in high-density environments.

- Dark mode strategy: Use a slate-based dark palette (Slate-900 for background) with adjusted contrast for Teal tokens.
- Known exceptions: Status badges use desaturated backgrounds of their respective status colors for better readability.

## Typography

Inter is the primary font stack for its excellent legibility in data-dense interfaces.

| Token | Font | Size | Weight | Line height | Usage |
|---|---|---|---|---|---|
| `body` | Inter | 14px | 400 | 1.5 | Default body, table data |
| `label` | Inter | 12px | 600 | 1.2 | Metadata, table headers |
| `heading-sm` | Inter | 18px | 600 | 1.4 | Card titles, section headers |
| `heading-md` | Inter | 24px | 700 | 1.2 | Page titles |
| `display` | Inter | 48px | 800 | 1.1 | Hero headings |

## Layout

A card-based layout strategy for admin views, utilizing a persistent sidebar for primary navigation.

- Layout strategy: Sidebar-Left (Admin) / Container-Centered (Public)
- Max content width: 1440px
- Breakpoints: sm (640px) / md (768px) / lg (1024px) / xl (1280px)

## Components

### Interactive States

| State | Visual rule | Accessibility rule |
|---|---|---|
| Default | Standard tokens applied. | Must meet 4.5:1 contrast. |
| Hover | 10% darkening or opacity shift. | Transition: 200ms ease. |
| Focus | 2px ring in Primary color with offset. | Must be visible for keyboard users. |
| Disabled | Opacity 50%, grayscale filter. | `aria-disabled="true"` |
| Error | Border-red-500, Background-red-50. | Must include text, not color alone. |

### Component Catalog

| Component | Variants | States | Notes |
|---|---|---|---|
| Button | Solid, Outline, Ghost | Default, Hover, Active, Loading | Solid is reserved for primary actions. |
| Input | Text, Select, Textarea | Default, Focus, Error, Disabled | Uses suttle shadows for depth. |
| Card | Default, Elevated | Static | Admin views use flat cards with borders. |
| Badge | Status-based (New, Success, etc) | Static | Uses pill shape (rounded-full). |

## Do's and Don'ts

- **Update** when a reusable token, component variant, layout rule, or accessibility rule changes.
- **Do not update** for normal use of existing components or one-off visual details.

### Known Exceptions

| Exception | Reason | Scope |
|---|---|---|
| Hero Section | Marketing-focused layout with non-standard spacing. | Home Page Only |
| Success Animation | Brand moment that overrides strict efficiency rules. | Success Page |