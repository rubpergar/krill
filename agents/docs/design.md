# Sistema de Diseño (Design System)

Fuente de verdad de UI/diseño reutilizable. Marcar como `Not applicable` para proyectos sin UI.

Documentar solo decisiones de UI duraderas y reutilizables aquí. No documentar detalles de pantallas puntuales.

Validación: `npx @google/design.md lint agents/docs/design.md` (opcional, requiere Node.js).

---

```yaml
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
```

## Visión General

- **Tipo de UI:**
- **Audiencia:**
- **Tono:**
- **Densidad:**
- **Objetivo de accesibilidad:** WCAG 2.2 AA (por defecto)
- **Modo oscuro:** compatible / planificado / no aplica

### Principios Visuales

Listar 3–6 principios que guíen las decisiones de UI reutilizables.

| Principio | Significado | Aplica a |
|---|---|---|
| | | |

## Colores

Explicar la paleta, reglas de uso de tokens y estrategia de modo oscuro.

- Estrategia de modo oscuro:
- Excepciones conocidas:

## Tipografía

Describir la jerarquía, la pila de fuentes (font stack) y las reglas de uso.

| Token | Fuente | Tamaño | Peso | Altura de línea | Uso |
|---|---|---|---|---|---|---|
| `body` | | | | | Cuerpo por defecto |
| `heading` | | | | | Encabezados |

## Layout

Definir puntos de quiebre (breakpoints), cuadrícula (grid) y comportamiento responsive.

- Estrategia de layout:
- Ancho máximo de contenido:
- Breakpoints: sm / md / lg / xl

## Componentes

### Estados Interactivos

| Estado | Regla visual | Regla de accesibilidad |
|---|---|---|
| Default | | |
| Hover | | No depender de affordances solo al hover |
| Focus | | Debe ser visible para usuarios de teclado |
| Disabled | | Debe comunicar estado no disponible |
| Error | | Debe incluir texto, no solo color |

### Catálogo de Componentes

| Componente | Variantes | Estados | Notas |
|---|---|---|---|---|
| Button | | | |
| Input | | | |
| Card | | | |
| Modal | | | |

## Qué Hacer y Qué No Hacer

- **Actualizar** cuando un token reutilizable, variante de componente, regla de layout o regla de accesibilidad cambie.
- **No actualizar** por uso normal de componentes existentes o detalles visuales puntuales.

### Excepciones Conocidas

| Excepción | Motivo | Alcance |
|---|---|---|
| | | |
