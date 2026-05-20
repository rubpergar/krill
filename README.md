# Incidencias Coworking

Sistema de gestión de incidencias para espacios de coworking. API REST con Fastify 5 + frontend React 19 con Vite 6, Tailwind CSS 3 y diseño bento dark.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node 22 LTS |
| Backend | Fastify 5, TypeScript, Zod |
| Frontend | React 19, Vite 6, Tailwind CSS 3, react-router-dom v7 |
| UI icons | lucide-react |
| Auth | @fastify/jwt, bcryptjs |
| Testing | Vitest, jsdom |
| Lint/format | Biome |
| Monorepo | pnpm workspaces |

## Arquitectura

```
incidencias-coworking/
├── backend/
│   ├── src/
│   │   ├── api/v1/        # Rutas REST (auth, incidents, comments, admin)
│   │   ├── modules/       # Lógica de negocio (auth, incidents, comments)
│   │   ├── shared/        # Middleware, errores, tipos comunes
│   │   └── config/        # Variables de entorno
│   ├── tests/             # Tests Vitest
│   └── seed.ts            # Población de datos de prueba
├── frontend/
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── components/    # Navbar, ProtectedRoute
│   │   ├── contexts/      # AuthContext
│   │   └── services/      # Cliente API tipado
│   └── tests/             # Tests Vitest + jsdom
└── pnpm-workspace.yaml
```

### Backend — API REST `/api/v1`

| Endpoint | Método | Auth | Descripción |
|---|---|---|---|
| `/auth/register` | POST | — | Registrar usuario |
| `/auth/login` | POST | — | Iniciar sesión |
| `/auth/me` | GET | user | Perfil del usuario autenticado |
| `/incidents` | GET | user | Listar incidencias propias (filtros + paginación) |
| `/incidents` | POST | user | Crear incidencia |
| `/incidents/:id` | GET | user | Detalle + comentarios |
| `/incidents/:id/status` | PATCH | user | Cambiar estado (máquina de estados) |
| `/incidents/:id/priority` | PATCH | user | Cambiar prioridad (solo admin) |
| `/incidents/:id/comments` | POST | user | Añadir comentario |
| `/incidents/:id/comments` | GET | user | Listar comentarios |
| `/admin/incidents` | GET | admin | Listar todas (filtros + paginación) |
| `/admin/health` | GET | admin | Health check |

#### Filtros y paginación

`GET /incidents` y `GET /admin/incidents` aceptan:

| Parámetro | Tipo | Ejemplo |
|---|---|---|
| `status` | string (csv) | `open,in_progress` |
| `priority` | string (csv) | `high,critical` |
| `category` | string (csv) | `hardware,network` |
| `dateFrom` | ISO date | `2025-01-01` |
| `dateTo` | ISO date | `2025-12-31` |
| `page` | number | `1` |
| `limit` | number | `20` |

Respuesta incluye `meta: { page, limit, total, pages }`.

#### Máquina de estados

```
open → in_progress → resolved → closed
  ↑____________________________|  (re-open)
```

#### Errores

```json
{ "ok": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```

### Frontend — SPA React

- **Login/Register** — formularios con validación y persistencia de token en localStorage
- **Dashboard** — grid bento con tarjetas de resumen, incidencias recientes, acceso rápido
- **AuthContext** — login, registro, logout, restauración automática al recargar
- **API service** — fetch wrapper tipado con manejo de errores y auto-logout en 401
- **Tema oscuro** — paleta custom (surface, primary, muted, border)

## Comandos

```bash
# Instalar dependencias
pnpm install

# Desarrollo (backend + frontend en paralelo)
pnpm dev

# Solo backend (puerto 3000)
pnpm dev:backend

# Solo frontend (puerto 5173, proxy /api → localhost:3000)
pnpm dev:frontend

# Backend con datos de prueba precargados
pnpm dev:seed        # alias: SEED=true pnpm --filter backend dev

# Poblar datos sin servidor
pnpm --filter backend seed

# Tests
pnpm test            # todos los workspaces
pnpm --filter backend test   # solo backend (145 tests)
pnpm --filter frontend test  # solo frontend (6 tests)

# Lint y typecheck
pnpm lint
pnpm typecheck

# Documentación OpenAPI
# http://localhost:3000/docs
```

## Datos de prueba

Ejecuta `pnpm dev:seed` o `pnpm --filter backend seed` para poblar:

| Email | Contraseña | Rol |
|---|---|---|
| `admin@coworking.com` | `admin123` | admin |
| `ana@example.com` | `123456` | user |
| `carlos@example.com` | `123456` | user |
| `laura@example.com` | `123456` | user |

Incluye 12 incidencias realistas con distintos estados, prioridades y categorías, más 9 comentarios.

## Configuración

Variables de entorno en `backend/.env`:

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `3000` | Puerto del servidor |
| `NODE_ENV` | `development` | Entorno |
| `JWT_SECRET` | (requerido) | Secreto para firmar tokens |
| `JWT_EXPIRES_IN` | `7d` | Duración del token |
| `ADMIN_EMAIL` | `admin@coworking.com` | Email del admin a seedear |
| `ADMIN_PASSWORD` | `admin123` | Contraseña del admin |

La autenticación usa JWT. Los tokens se envían como `Authorization: Bearer <token>`.

## Tests

- **Backend:** 145 tests (auth, roles, incidents CRUD, filtros, paginación, máquina de estados, flujos completos de usuario y admin)
- **Frontend:** 6 tests (API service mockeado)

## Licencia

MIT. Ver [LICENSE](LICENSE).
