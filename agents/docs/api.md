# API Contracts

Mark as `Not applicable` if the project exposes no public API.

Document only public contracts that clients depend on.

## Conventions
- Base URL: `/api/v1`
- Auth: JWT via Bearer token
- Error format: `{ ok: boolean, data?: T, error?: { code: string, message: string, details?: unknown } }`
- Pagination: `{ page, limit, total, pages }` en `meta`
- Versioning/compatibility: `/api/v1` en ruta. Cambios breaking === nueva versión.

## Routes
| Method | Path | Auth | Request | Response | Notes |
|---|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | No | `{ email, password, name }` | `{ user, token }` | Registro de usuario |
| `POST` | `/api/v1/auth/login` | No | `{ email, password }` | `{ user, token }` | Inicio de sesión |
| `GET` | `/api/v1/auth/me` | JWT | — | `{ user }` | Perfil del usuario autenticado |
| `POST` | `/api/v1/incidents` | JWT | `{ title, description, category, priority }` | `{ incident }` | Crear incidencia |
| `GET` | `/api/v1/incidents` | JWT | `?page=1&limit=20&status=open,in_progress&priority=high,critical&category=software&dateFrom=2026-01-01&dateTo=2026-12-31` | `{ incidents[], meta }` | Listado de incidencias propias con filtros y paginación |
| `GET` | `/api/v1/incidents/:id` | JWT | — | `{ incident { ..., comments[] } }` | Detalle de incidencia con comentarios incluidos |
| `PATCH` | `/api/v1/incidents/:id/status` | JWT | `{ status }` | `{ incident }` | Cambiar estado |
| `PATCH` | `/api/v1/incidents/:id/priority` | JWT | `{ priority }` | `{ incident }` | Cambiar prioridad |
| `POST` | `/api/v1/incidents/:id/comments` | JWT | `{ content }` | `{ comment }` | Añadir comentario |
| `GET` | `/api/v1/incidents/:id/comments` | JWT | — | `{ comments[] }` | Listar comentarios |
| `GET` | `/api/v1/admin/health` | JWT + admin | — | `{ ok }` | Health check admin |
| `GET` | `/api/v1/admin/incidents` | JWT + admin | `?page=1&limit=20&status=open&priority=high&category=software&dateFrom=2026-01-01&dateTo=2026-12-31` | `{ incidents[], meta }` | Panel admin: todas las incidencias con filtros y paginación |

## Enums

### IncidentStatus
`open` | `in_progress` | `resolved` | `closed`

### IncidentPriority
`low` | `medium` | `high` | `critical`

### IncidentCategory
`hardware` | `software` | `network` | `facilities` | `other`

## Error Codes
| Code | Meaning | HTTP |
|---|---|---|
| `UNAUTHORIZED` | Token inválido o ausente | 401 |
| `FORBIDDEN` | Sin permisos de rol | 403 |
| `NOT_FOUND` | Recurso no encontrado | 404 |
| `DUPLICATE_EMAIL` | Email ya registrado | 409 |
| `INVALID_CREDENTIALS` | Email o contraseña incorrectos | 401 |
| `VALIDATION_ERROR` | Body/params inválidos | 400 |
| `INTERNAL_ERROR` | Error interno del servidor | 500 |

## Compatibility Notes
- Todas las rutas protegidas requieren header `Authorization: Bearer <token>`
- Los IDs de incidencias y usuarios son UUID v4
- Timestamps en formato ISO 8601
