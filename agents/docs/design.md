# Design System

Reusable UI/design source of truth.

## Overview
- **UI type:** Dashboard / Bento grid
- **Audience:** Coworking clients and admins
- **Tone:** Professional, clean, dark theme
- **Density:** Comfortable
- **Accessibility target:** WCAG 2.2 AA
- **Dark mode:** Default (solo modo oscuro)

### Visual Principles
| Principle | Meaning | Applies to |
|---|---|---|
| Oscuro por defecto | Fondo surface (neutral-950), texto neutral-100 | All surfaces |
| Cards bento | Bordes sutiles, bg surface-card, border-border | All cards |
| Primary accent | Cyan/teal para acciones y highlights | Buttons, links, icons |

## Colors
| Token | Tailwind value | Usage |
|---|---|---|
| `surface` | `#0a0a0f` | Fondo principal de página |
| `surface-card` | `#14141f` | Fondo de cards |
| `surface-elevated` | `#1c1c2e` | Fondo elevado (hover, badges) |
| `surface-hover` | `#262640` | Hover de cards |
| `primary` | `#22d3ee` (cyan-400) | Acciones, links, iconos activos |
| `primary-hover` | `#06b6d4` (cyan-500) | Hover de botones primary |
| `muted` | `#73738c` | Texto secundario |
| `muted-foreground` | `#a1a1b5` | Texto terciario |
| `border` | `#2a2a3e` | Bordes por defecto |
| `border-light` | `#3a3a4e` | Bordes elevados |

## Typography
Default system font stack via Tailwind. No custom fonts.

| Token | Size | Weight | Usage |
|---|---|---|---|
| `body` | text-sm (14px) | normal | Default text |
| `heading` | text-xl / text-2xl | medium | Page titles |
| `stat` | text-2xl | semibold | Stat values |
| `label` | text-sm | normal | Form labels |

## Layout
- **Max content width:** 72rem (max-w-6xl)
- **Bento grid:** 1 col mobile → 2 col tablet → 3-4 col desktop
- **Card rounded:** 1rem (rounded-bento)
- **Spacing:** Tailwind defaults (p-4, p-5 cards, gap-4 grid)
- **Breakpoints:** sm (640px), md (768px), lg (1024px)

## Components

### Interactive States
| State | Visual rule | Accessibility rule |
|---|---|---|
| Default | bg-surface-card, border-border | — |
| Hover | bg-surface-hover, transition-colors | Do not rely on hover-only affordances |
| Focus | ring-1 ring-primary, border-primary | Must be visible for keyboard users |
| Disabled | opacity-50, cursor-not-allowed | Must communicate unavailable state |
| Error | bg-red-900/20, text-red-400 | Must include text, not color alone |

### Component Catalog
| Component | Variants | States | Notes |
|---|---|---|---|
| Button | Primary, ghost | Default, hover, focus, disabled | Primary: bg-primary text-surface. Ghost: transparent |
| Input | Text, email, password | Default, focus, error, disabled | Border border-border, focus border-primary |
| Card | StatCard | Default, hover | Rounded-bento, p-5 |
| Badge | StatusBadge | Default | Rounded-full, icon + label |
| Navbar | Sticky | Default | bg-surface/80 backdrop-blur, border-bottom |

## Do's and Don'ts
- **Update** when a reusable token, component variant, layout rule, or accessibility rule changes.
- **Do not update** for normal use of existing components or one-off visual details.
