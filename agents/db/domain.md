# Domain Model

## Entities
| Entity | Meaning | Notes |
|---|---|---|
| `User` | Usuario del sistema | Puede ser `user` (regular) o `admin` |
| `Incident` | Incidencia reportada por un usuario | Pertenece a un usuario via `userId` |
| `Comment` | Comentario interno sobre una incidencia | Pertenece a una incidencia via `incidentId` |

## Relationships
- `User` 1→* `Incident` (un usuario puede tener muchas incidencias)
- `Incident` 1→* `Comment` (una incidencia puede tener muchos comentarios)
- `Admin` puede ver/actuar sobre cualquier incidencia
- `User` regular solo ve/actúa sobre sus propias incidencias

## Business Rules
- Una incidencia se crea siempre con estado `open` por defecto
- Un usuario regular no puede ver incidencias de otros usuarios (devuelve 404)
- Admin puede ver todas las incidencias
- Los comentarios solo pueden añadirse a incidencias existentes
- El email de usuario es único en el sistema

### State Machine: Transiciones de estado de incidencia

| Desde | Hacia válido |
|---|---|
| `open` | `open`, `in_progress`, `resolved`, `closed` |
| `in_progress` | `open`, `in_progress`, `resolved` |
| `resolved` | `open`, `in_progress`, `resolved`, `closed` |
| `closed` | `open`, `closed` |

Transiciones inválidas devuelven error `400 INVALID_STATUS_TRANSITION`.
Transiciones al mismo estado (no-op) están permitidas.

## Glossary
| Term | Meaning |
|---|---|
| Incidencia | Reporte de un problema en el espacio de coworking |
| Categoría | Tipo de incidencia: hardware, software, network, facilities, other |
| Prioridad | Nivel de urgencia: low, medium, high, critical |
| Estado | Estado del ciclo de vida: open, in_progress, resolved, closed |
