# Contratos de API

## Convenciones
- URL base: `/api/v1`
- Autenticación: `Authorization: Bearer <access_token>` (JWT, HS256)
- Formato de error: `{ error: string }`
- Formato de éxito: `{ data: {...} }`
- Paginación: `{ data: [...], pagination: { page, limit, total, totalPages } }`
- Versiones/compatibilidad: API versionada desde el inicio bajo `/api/v1`
- Helpers de respuesta: `success()`, `error()`, `paginated()` en `shared/api-response.ts`
- Router central: `/api/v1` montado desde `modules/v1/index.ts`

## Rutas

### Health (`/api/v1/health`)

| Método | Ruta | Respuesta | Notas |
|---|---|---|---|
| GET | `/api/v1/health` | `200 { status: 'ok', timestamp: '<ISO>' }` | Sin autenticación. Verifica que la API responde. |

### Auth (`/api/v1/auth`)

| Método | Ruta | Solicitud | Respuesta | Notas |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | `{ email, password, name }` | `201 { data: { user } }` | Crea usuario. Normaliza email a lowercase. |
| POST | `/api/v1/auth/login` | `{ email, password }` | `200 { data: { accessToken, refreshToken, user } }` | Access token 15min, refresh 7d rotado. |
| GET | `/api/v1/auth/me` | Header `Authorization: Bearer <token>` | `200 { data: { user } }` | Perfil del usuario autenticado. |
| POST | `/api/v1/auth/refresh` | `{ refreshToken }` | `200 { data: { accessToken, refreshToken } }` | Rotación de refresh token. |
| POST | `/api/v1/auth/logout` | `{ refreshToken }` | `204` | Invalida refresh token en BD. |

### Admin (`/api/v1/admin`)

| Método | Ruta | Auth | Respuesta | Notas |
|---|---|---|---|---|
| GET | `/api/v1/admin/me` | `requireAuth` + `requireRole('admin')` | `200 { data: { user } }` | Perfil del admin autenticado. |

### Admin - Incidencias (`/api/v1/admin/incidents`)

| Método | Ruta | Auth | Solicitud | Respuesta | Notas |
|---|---|---|---|---|---|
| GET | `/api/v1/admin/incidents` | admin | Query: `page?`, `limit?`, `status?`, `priority?`, `created_by?` | `200 { data: [...], pagination }` | Listado global paginado de todas las incidencias. |
| GET | `/api/v1/admin/incidents/:id` | admin | - | `200 { data: { incident } }` | Detalle de cualquier incidencia (sin ownership check). 404 si no existe. |
| PATCH | `/api/v1/admin/incidents/:id/status` | admin | `{ status }` | `200 { data: { incident } }` | Cambia status: open, in_progress, resolved, closed. |
| PATCH | `/api/v1/admin/incidents/:id/priority` | admin | `{ priority }` | `200 { data: { incident } }` | Cambia priority: low, medium, high, critical. |
| PATCH | `/api/v1/admin/incidents/:id/assign` | admin | `{ assignedTo? }` | `200 { data: { incident } }` | Asigna incidencia. Sin body asigna al admin autenticado. |

### Incidents (`/api/v1/incidents`)

| Método | Ruta | Auth | Solicitud | Respuesta | Notas |
|---|---|---|---|---|---|
| POST | `/api/v1/incidents` | `requireAuth` | `{ title, description, priority? }` | `201 { data: { incident } }` | Crea incidencia. Priority default 'medium'. Status inicial 'open'. |
| GET | `/api/v1/incidents` | `requireAuth` | Query: `page?`, `limit?`, `status?`, `priority?` | `200 { data: [...], pagination }` | Listado paginado de incidencias del usuario. Default page=1, limit=10. |
| GET | `/api/v1/incidents/:id` | `requireAuth` | - | `200 { data: { incident } }` | Detalle de incidencia. 404 si no existe o no pertenece al usuario. |

### Autorización

| Middleware | Propósito | Código en fallo |
|---|---|---|
| `requireAuth` | Verifica JWT e inyecta `jwtPayload` | `401` si falta o es inválido |
| `requireRole('admin')` | Requiere rol específico (se compone con requireAuth) | `403` si el rol no coincide |

### Códigos de Error Comunes
- `400`: Validation error (input inválido)
- `401`: No autorizado (token faltante/inválido/expirado)
- `403`: Prohibido (rol insuficiente)
- `409`: Conflicto (email ya registrado)
- `500`: Error interno del servidor

## Notas de Compatibilidad
- Todas las rutas de auth (excepto `/me`, `/refresh`, `/logout`) son públicas.
- `/refresh` y `/logout` usan el refresh token del body, no el access token.
- Las rutas admin requieren autenticación y rol `admin`.
- `requireAuth` debe ejecutarse antes que `requireRole` en la cadena de middlewares.
