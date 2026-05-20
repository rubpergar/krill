# Sistema de Diseño

Fuente de verdad de UI/diseño reutilizable.

## Descripción General

- **Tipo de UI:** Dashboard / Admin tool
- **Audiencia:** Usuarios y administradores de coworking
- **Tono:** Profesional, claro, funcional
- **Densidad:** Media
- **Objetivo de accesibilidad:** WCAG 2.2 AA
- **Modo oscuro:** no aplica (MVP)

### Principios Visuales

| Principio | Significado | Aplica a |
|---|---|---|
| Clara jerarquía | La info más importante destaca visualmente | Dashboard, tablas, detalle |
| Estados visibles | Cada acción tiene feedback inmediato | Formularios, botones, listas |
| Consistencia | Mismos patrones en todo el sistema | Componentes, espaciado, colores |
| Mobile-first | Funcional en cualquier viewport | Layout, navegación, tablas |

## Colores

Paleta basada en Tailwind neutral + blue como semantic primary.

| Token | Clase Tailwind | Uso |
|---|---|---|
| `surface` | `bg-white` | Fondo principal |
| `surface-muted` | `bg-neutral-50` | Fondo secundario / cards |
| `foreground` | `text-neutral-900` | Texto principal |
| `muted` | `text-neutral-500` | Texto secundario / labels |
| `border` | `border-neutral-200` | Bordes de componentes |
| `primary` | `bg-blue-600 text-white` | Botones, enlaces, acentos |
| `primary-hover` | `bg-blue-700` | Hover de primary |
| `success` | `text-green-600` / `bg-green-100` | Status resolved |
| `warning` | `text-amber-500` / `bg-amber-100` | Status in_progress |
| `danger` | `text-red-600` / `bg-red-100` | Status/priority crítico |
| `info` | `text-blue-600` / `bg-blue-100` | Status/priority info |
| `focus` | `ring-blue-500` | Focus visible |

## Tipografía

| Token | Fuente | Tamaño | Peso | Uso |
|---|---|---|---|---|
| `body` | system-ui sans | `text-sm` (14px) | 400 | Cuerpo predeterminado |
| `body-large` | system-ui sans | `text-base` (16px) | 400 | Cuerpo amplio |
| `heading` | system-ui sans | `text-lg` (18px) | 600 | Encabezados de sección |
| `heading-page` | system-ui sans | `text-2xl` (24px) | 700 | Título de página |
| `small` | system-ui sans | `text-xs` (12px) | 500 | Labels, badges, metadata |

## Diseño

- **Estrategia de diseño:** Bento grid responsivo (Tailwind grid)
- **Ancho máximo de contenido:** `max-w-7xl`
- **Puntos de quiebre:** sm (640px) / md (768px) / lg (1024px) / xl (1280px)
- **Bento grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`

## Componentes

### Estados Interactivos

| Estado | Regla visual | Regla de accesibilidad |
|---|---|---|
| Predeterminado | Fondo primary / border neutral | Contraste 4.5:1+ |
| Hover | Opacidad 90% o color más oscuro | No depender de affordances solo por hover |
| Focus | `ring-2 ring-blue-500 ring-offset-2` | Visible para teclado |
| Deshabilitado | Opacidad 50%, cursor not-allowed | Comunicar estado no disponible |
| Error | Borde rojo + texto helper | Incluir texto, no solo color |

### Catálogo de Componentes

| Componente | Variantes | Estados | Notas |
|---|---|---|---|
| Button | primary, secondary, ghost, danger | default, hover, focus, disabled, loading | Loading con spinner SVG inline |
| Input | text, email, password, select | default, focus, error, disabled | Label visible siempre |
| Card | default, interactive | default, hover | Sombra sutil, borde neutral |
| Badge | status, priority | según color mapping | Mapping status→color en helper |
| Skeleton | text, card, avatar | animación pulse | Ocupa mismo espacio que contenido |
| Toast | success, error, info | visible, hidden | Auto-dismiss 4s, aria-live polite |

## Qué Hacer y Qué No Hacer

- **Actualiza** cuando un token reutilizable, variante de componente, regla de diseño o regla de accesibilidad cambie.
- **No actualices** por uso normal de componentes existentes o detalles visuales puntuales.

### Excepciones Conocidas

| Excepción | Razón | Alcance |
|---|---|---|
| Modo oscuro | Fuera de MVP | Post-MVP |
| framer-motion | Dependencia existente pero no usada en MVP | Futura iteración |
