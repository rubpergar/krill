# Plan de Tarea

## Estado
`borrador`

## Tarea
- ID: TASK-001
- Título: Implementar autenticación de usuarios y gestión de sesión/token
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Implementar el subsistema de autenticación: registro de usuarios, login, logout, refresh de token y perfil propio. Esto incluye el modelo de usuario, persistencia, endpoints REST bajo `/api/v1/auth` y middleware de verificación JWT.

## Alcance

**Incluye:**
- Modelo de datos de usuario (id, email, password_hash, nombre, rol, timestamps)
- Tabla `users` en SQLite vía Drizzle ORM
- Endpoints:
  - `POST /api/v1/auth/register` — registro con email, contraseña, nombre
  - `POST /api/v1/auth/login` — login, devuelve access + refresh token
  - `POST /api/v1/auth/refresh` — refresh token rotado
  - `POST /api/v1/auth/logout` — invalidación de refresh token
  - `GET /api/v1/auth/me` — perfil del usuario autenticado
- Middleware `verifyAuth` que extrae y valida el JWT, e inyecta `c.set('user', payload)`
- Password hashing con bcrypt
- JWT asimétrico o HMAC con `jose` (access: 15min, refresh: 7d)
- Validación Zod en todos los inputs
- Formato de respuesta JSON consistente (`{ data, error }`)
- Manejo centralizado de errores HTTP (400, 401, 409, etc.)
- Tests unitarios de registro, login, refresh, logout, me
- Tests de integración del flujo completo contra SQLite

**Excluye (explícitamente excluido):**
- Roles y permisos (se implementan en TASK-002)
- Protección de rutas que no sean de auth (ídem TASK-002)
- Endpoints admin
- Frontend de login/registro (es parte de TASK-007)
- Rate limiting (se puede añadir después si es necesario)
- Verificación de email / flujo de recuperación de contraseña
- OpenAPI docs completas (se añaden cuando se documenten todas las rutas)

## Comportamiento Actual
No existe ningún subsistema de autenticación. La API devuelve solo el spec OpenAPI vacío y Swagger UI.

## Comportamiento Esperado
- Un usuario puede registrarse con email, contraseña y nombre.
- Un usuario registrado puede hacer login y recibe un par access/refresh token.
- El access token (JWT, 15min) permite autenticarse en `GET /api/v1/auth/me`.
- El refresh token (JWT, 7d) permite obtener un nuevo par sin rehacer login.
- Al hacer logout, el refresh token se invalida (lista negra o borrado).
- Errores de validación, credenciales inválidas, email duplicado devuelven respuestas estructuradas.

## Criterios de Aceptación
- [ ] `POST /api/v1/auth/register` crea un usuario y devuelve `201` con perfil (sin contraseña).
- [ ] `POST /api/v1/auth/register` rechaza email mal formado o contraseña < 8 chars con `400`.
- [ ] `POST /api/v1/auth/register` rechaza email duplicado con `409`.
- [ ] `POST /api/v1/auth/login` devuelve `200` con `{ accessToken, refreshToken, user }`.
- [ ] `POST /api/v1/auth/login` rechaza credenciales inválidas con `401`.
- [ ] `GET /api/v1/auth/me` devuelve `200` con perfil del usuario (token válido).
- [ ] `GET /api/v1/auth/me` devuelve `401` sin token o con token inválido/expirado.
- [ ] `POST /api/v1/auth/refresh` devuelve nuevo par de tokens.
- [ ] `POST /api/v1/auth/refresh` rechaza refresh token inválido/expirado con `401`.
- [ ] `POST /api/v1/auth/logout` invalida el refresh token y devuelve `204`.
- [ ] Middleware `verifyAuth` inyecta `c.get('user')` con `{ id, email, role }`.
- [ ] La contraseña nunca se devuelve en ninguna respuesta.
- [ ] Tests unitarios y de integración pasan.

## Casos Borde
- Email con espacios al inicio/final (debe sanitizarse).
- Contraseña con caracteres Unicode.
- Doble registro con el mismo email.
- Token expirado justo en el momento de la petición.
- Refresh token reutilizado después de logout (debe rechazarse).
- Cuerpo de petición malformado (JSON inválido).
- Headers de autorización mal formados (sin "Bearer", vacío, etc.).

## Supuestos / Riesgos
- SQLite con better-sqlite3 se usará como BD inicial (sin servidor externo).
- La migración inicial de `users` se hará con Drizzle Kit (push a SQLite).
- Las contraseñas se hashean con bcrypt (coste 10-12).
- Los refresh tokens se persisten en BD para poder invalidarlos.
- **Riesgo:** Decidir entre sesiones vs JWT impacta la arquitectura. JWT se elige por ser stateless en access, pero requiere gestión activa de refresh.
- **Riesgo:** La dependencia `bcrypt` requiere build nativo. Alternativa: `bcryptjs` (puro JS, más lento pero sin compilación).

## Impacto en Base de Datos

- Resumen de cambios: Creación de tabla `users` con Drizzle ORM sobre SQLite.
- Archivo de esquema de BD del Mapa de Fuente de Verdad: `agents/db/schema.sql`
- Archivo de registro de cambios de BD del Mapa de Fuente de Verdad: `agents/db/changes.sql`
- Estructuras/datos afectados: Tabla `users` (id, email, password_hash, name, role, refresh_token_hash?, created_at, updated_at)
- Enfoque de migración de avance: Drizzle Kit `push` sobre SQLite local (no hay migraciones formales hasta que se necesite PostgreSQL)
- Enfoque de reversión: Drizzle Kit `drop` o borrado manual del archivo SQLite
- Compatibilidad de datos persistentes: No aplica (primera migración)
- Riesgos operativos: Ninguno (desarrollo local, sin datos reales)
- Plan de validación: Tests de integración con SQLite en memoria
- Notas de respaldo/recuperación: No aplica
- Actualizaciones de documentación requeridas: `agents/db/schema.sql`, `agents/db/changes.sql`, `agents/db/domain.md`, `agents/docs/api.md`

## Preguntas Abiertas

1. **Base de datos ahora:** ¿Añadimos SQLite + Drizzle ORM como parte de esta tarea o prefieres que la autenticación funcione con un store en memoria (Map) y añadamos BD más adelante? La opción recomendada es SQLite desde ahora, porque Drizzle apenas añade complejidad y los tests necesitan persistencia real.

2. **Gestión de refresh tokens:** ¿Persistir los refresh tokens en BD (permitiendo invalidación individual) o confiar solo en la expiración del JWT? Recomiendo persistencia en BD para poder hacer logout efectivo.

3. **Password hashing:** ¿Prefieres `bcrypt` (requiere compilación nativa, más rápido) o `bcryptjs` (JS puro, más lento, sin build)? Recomiendo `bcrypt` si el entorno lo soporta (Node 22 sí), con `bcryptjs` como fallback.

4. **Hash de refresh token:** ¿Almacenar el refresh token hasheado en BD (más seguro) o en texto plano? Recomiendo hasheado (SHA-256) por seguridad.

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `agents/docs/decisions.md`
- `agents/docs/dependency-policy.md`
- `agents/db/schema.sql`
- `agents/db/changes.sql`
- `agents/db/domain.md`

## Registros de Decisiones

- ADRs leídos de `agents/docs/decisions.md`: Ninguno (registro vacío).

- Nuevas decisiones a registrar después de la aprobación del usuario:

### ADR-001: JWT con access + refresh tokens para autenticación
- **Contexto:** Necesitamos un mecanismo de autenticación stateless para la API REST. Alternativas: sesiones con cookies (stateful, requiere almacenamiento en servidor), JWT sin refresh (menos seguro si el token se expone), API keys (no apto para usuarios finales).
- **Decisión:** Usar JWT HMAC con `jose`. Access token corto (15min) en memory/header, refresh token largo (7d) persistido en BD para permitir rotación e invalidación.
- **Consecuencias:** Stateless en access (rápido, escalable). Stateful en refresh (permite logout). Se necesita BD para persistir refresh tokens.

### ADR-002: SQLite + better-sqlite3 + Drizzle ORM como base de datos inicial
- **Contexto:** La autenticación necesita persistencia (usuarios, refresh tokens). Alternativas: PostgreSQL (requiere servidor externo), almacenamiento en memoria (se pierde al reiniciar), SQLite (archivo local, zero config).
- **Decisión:** Usar SQLite con better-sqlite3 y Drizzle ORM. La capa de abstracción Drizzle permite migrar a PostgreSQL más adelante cambiando el driver.
- **Consecuencias:** Desarrollo sin depender de servicios externos. Fácil de testear con BD en memoria.

### ADR-003: bcrypt para password hashing
- **Contexto:** Necesitamos hashear contraseñas de forma segura. Alternativas: `bcrypt` (nativo, rápido), `bcryptjs` (JS puro, más lento, sin build), `argon2` (más moderno pero requiere compilación).
- **Decisión:** Usar `bcrypt` con coste 12 por su madurez, velocidad y soporte en Node 22.
- **Consecuencias:** Requiere build nativo (funciona en Node 22 sin problemas). Si el entorno no lo soporta, caer a `bcryptjs`.
