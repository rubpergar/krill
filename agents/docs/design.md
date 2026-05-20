# Sistema de Diseño

Fuente de verdad de UI/diseño reutilizable. Marca como `Not applicable` para proyectos sin interfaz de usuario.

Documenta solo decisiones de UI duraderas y reutilizables aquí. No documentes detalles de pantallas puntuales.

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

## Descripción General

- **Tipo de UI:**
- **Audiencia:**
- **Tono:**
- **Densidad:**
- **Objetivo de accesibilidad:** WCAG 2.2 AA (predeterminado)
- **Modo oscuro:** compatible / planeado / no aplica

### Principios Visuales

Enumera 3 a 6 principios que guían las decisiones de UI reutilizables.

| Principio | Significado | Aplica a |
|---|---|---|
| | | |

## Colores

Explica la paleta, las reglas de uso de tokens y la estrategia de modo oscuro.

- Estrategia de modo oscuro:
- Excepciones conocidas:

## Tipografía

Describe la jerarquía, la pila de fuentes y las reglas de uso.

| Token | Fuente | Tamaño | Peso | Altura de línea | Uso |
|---|---|---|---|---|---|
| `body` | | | | | Cuerpo predeterminado |
| `heading` | | | | | Encabezados |

## Diseño

Define puntos de quiebre, cuadrícula y comportamiento responsive.

- Estrategia de diseño:
- Ancho máximo de contenido:
- Puntos de quiebre: sm / md / lg / xl

## Componentes

### Estados Interactivos

| Estado | Regla visual | Regla de accesibilidad |
|---|---|---|
| Predeterminado | | |
| Hover | | No depender de affordances solo por hover |
| Focus | | Debe ser visible para usuarios de teclado |
| Deshabilitado | | Debe comunicar el estado no disponible |
| Error | | Debe incluir texto, no solo color |

### Catálogo de Componentes

| Componente | Variantes | Estados | Notas |
|---|---|---|---|
| Botón | | | |
| Campo de texto | | | |
| Tarjeta | | | |
| Modal | | | |

## Qué Hacer y Qué No Hacer

- **Actualiza** cuando un token reutilizable, variante de componente, regla de diseño o regla de accesibilidad cambie.
- **No actualices** por uso normal de componentes existentes o detalles visuales puntuales.

### Excepciones Conocidas

| Excepción | Razón | Alcance |
|---|---|---|
| | | |
