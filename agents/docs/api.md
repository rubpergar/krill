# API Contracts

Mark as `Not applicable` if the project exposes no public API.

Document only public contracts that clients depend on.

## Conventions
- Base URL: `/api/v1`
- Auth: JWT (pendiente de implementar)
- Error format: `{ ok: boolean, data?: T, error?: { code: string, message: string, details?: unknown } }`
- Pagination: `{ page, limit, total, pages }` en `meta` (pendiente de implementar)
- Versioning/compatibility: `/api/v1` en ruta. Cambios breaking === nueva versión.

## Routes
| Method | Path | Request | Response | Notes |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | `{ email, password, name }` | `{ user, token }` | Registro de usuario |
| `POST` | `/api/v1/auth/login` | `{ email, password }` | `{ user, token }` | Inicio de sesión |
| `GET` | `/api/v1/incidents` | Query: `?status=&priority=&category=&dateFrom=&dateTo=` | `{ incidents[], meta }` | Listado de incidencias propias |
| `POST` | `/api/v1/incidents` | `{ title, description, category, priority }` | `{ incident }` | Crear incidencia |
| `GET` | `/api/v1/incidents/:id` | — | `{ incident }` | Detalle de incidencia |
| `PATCH` | `/api/v1/incidents/:id/status` | `{ status }` | `{ incident }` | Cambiar estado |
| `PATCH` | `/api/v1/incidents/:id/priority` | `{ priority }` | `{ incident }` | Cambiar prioridad |
| `GET` | `/api/v1/admin/incidents` | Query: `?status=&priority=&category=&page=&limit=` | `{ incidents[], meta }` | Panel admin: todas las incidencias |
| `POST` | `/api/v1/incidents/:id/comments` | `{ content }` | `{ comment }` | Añadir comentario interno |

## Compatibility Notes
- ...
