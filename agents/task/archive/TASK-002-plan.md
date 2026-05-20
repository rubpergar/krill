# Plan de Tarea

## Estado
`borrador`

## Tarea
- ID: TASK-002
- Título: Implementar roles, permisos y protección de rutas usuario/admin
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Crear el sistema de autorización basado en roles (user/admin), middleware reutilizable de protección de rutas, y refactorizar las rutas existentes de auth para usar el nuevo middleware. Preparar la estructura base del módulo admin.

## Alcance

**Incluye:**
- Middleware `requireAuth` (reemplaza el inline `jwt()` en `/me`) con extracción y validación de JWT
- Middleware `requireRole('admin')` que verifica `jwtPayload.role` después de `requireAuth`
- Refactor de `GET /api/v1/auth/me` para usar `requireAuth`
- Refactor de `auth.routes.ts` para separar la lógica de middleware de las rutas
- Endpoint `GET /api/v1/admin/me` (protegido con `requireAdmin`) que devuelve perfil + rol
- Pruebas unitarias para `requireAuth` (token válido, sin token, token inválido)
- Pruebas unitarias para `requireRole` (admin ok, user rechazado, sin auth)
- Pruebas de integración del flujo completo con roles

**Excluye (explícitamente excluido):**
- Endpoints funcionales de admin (gestión de incidencias, usuarios, etc.) → TASK-006
- Cambios en el modelo de datos (el campo `role` ya existe en users desde TASK-001)
- Endpoint para cambiar rol de usuario (será parte de TASK-006)
- Frontend de roles (será parte de TASK-007)
- Rutas protegidas más allá de auth y admin placeholder

## Comportamiento Actual
- El middleware JWT está inline en `authRoutes.get('/me', ...)` y no es reutilizable.
- No existe verificación de roles.
- No hay rutas protegidas por admin.
- El archivo `auth.middleware.ts` existe como placeholder pero no se usa.

## Comportamiento Esperado
- `requireAuth` es un middleware exportable que verifica JWT y setea `c.get('jwtPayload')`.
- `requireRole('admin')` se puede componer con `requireAuth` para proteger rutas admin.
- Las rutas existentes que necesitan auth usan `requireAuth` de forma declarativa.
- `GET /api/v1/admin/me` existe y solo responde si el usuario tiene role `admin`.
- Un usuario con role `user` recibe `403 Forbidden` al acceder a rutas admin.

## Criterios de Aceptación
- [ ] `requireAuth` extrae token de `Authorization: Bearer`, verifica JWT, inyecta `jwtPayload`.
- [ ] `GET /api/v1/auth/me` funciona igual que antes usando `requireAuth`.
- [ ] `requireAuth` devuelve `401` sin token o token inválido.
- [ ] `requireRole('admin')` devuelve `403` si role !== 'admin'.
- [ ] `GET /api/v1/admin/me` devuelve `200 { data: { user } }` para admin.
- [ ] `GET /api/v1/admin/me` devuelve `403` para usuario normal.
- [ ] Los tests existentes de TASK-001 siguen pasando.

## Casos Borde
- Token expirado → 401 (ya manejado por jwt middleware)
- Role en token pero middleware espera string → comparación exacta
- Composición de múltiples middlewares (requireAuth + requireRole)
- Middleware aplicado a ruta que no tiene jwtPayload (error interno controlado)

## Supuestos / Riesgos
- El campo `role` en el JWT es un string plano (`'user'` | `'admin'`).
- Los roles se asignan al crear usuario (default `user`) y pueden cambiarse en el futuro.
- No se necesita un sistema de permisos granular (solo dos roles).
- **Riesgo:** La composición de middlewares en Hono puede tener orden de ejecución sutil. Se probará explícitamente.
- **Riesgo:** El middleware `jwt` de Hono lanza HTTPException que debe ser capturado por `onError` y manejado como 401.

## Impacto en Base de Datos
`No aplica`. El campo `role` ya existe en la tabla `users` desde TASK-001. No hay cambios de esquema.

## Preguntas Abiertas
1. **Middleware propio vs Hono jwt**: ¿Crear `requireAuth` desde cero (usando `jose`/`hono/jwt` internamente) o envolver el middleware `jwt` de Hono para hacerlo reutilizable? Recomiendo envolver `jwt` de Hono para mantener consistencia.

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `agents/task/TASK-001-plan.md` (archivado, para contexto)
- `agents/db/domain.md`

## Registros de Decisiones
- ADRs leídos de `agents/docs/decisions.md`: Ninguno (registro vacío).
- Nuevas decisiones: No se esperan ADRs nuevos. El sistema de roles (user/admin) es una decisión local de la tarea.
