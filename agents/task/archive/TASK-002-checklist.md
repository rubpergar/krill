# Lista de Verificación de Tarea

## Fuente
- Tarea: TASK-002
- Plan: `agents/task/TASK-002-plan.md`

## Lista de Verificación

### 1. Contexto
- [x] Vuelve a leer el plan aprobado y los documentos fuente de verdad referenciados.
- [x] Aplica skill TDD.
- [x] Verifica que ninguna pregunta abierta bloquee la implementación.

### 2. Registro TDD

- [x] RED: Escribir test de requireAuth (token válido inyecta payload)
- [x] RED: Escribir test de requireAuth (sin token → 401)
- [x] RED: Escribir test de requireAuth (token inválido → 401)
- [x] RED: Escribir test de requireRole('admin') (rol admin → OK)
- [x] RED: Escribir test de requireRole('admin') (rol user → 403)
- [x] RED: Escribir test de requireRole('admin') (sin auth → 401)
- [x] RED: Escribir test de GET /api/v1/admin/me (admin → 200)
- [x] RED: Escribir test de GET /api/v1/admin/me (user → 403)
- [x] RED: Verificar que tests de TASK-001 siguen pasando
- [x] GREEN: Implementar requireAuth y requireRole
- [x] GREEN: Refactorizar auth.routes.ts para usar requireAuth
- [x] GREEN: Implementar GET /api/v1/admin/me
- [x] REFACTOR: Limpiar y asegurar todos los tests verdes

### 3. Alcance y Documentos
- [x] Todos los ciclos TDD completados.
- [x] Los cambios se mantuvieron dentro del alcance aprobado.
- [x] Hallazgos fuera de alcance registrados.
- [x] Documentos duraderos actualizados (`agents/docs/api.md`).

### 4. Controles de Cambios de Base de Datos
No aplica. Sin cambios de BD.

### 5. Validación
- [x] Pruebas específicas: 24 tests (15 auth + 6 middleware + 3 admin)
- [x] Suite de pruebas completa: `pnpm test` (24/24 pass)
- [x] Lint: `pnpm --filter @krill/api lint` (OK)
- [x] Verificación de tipos: `pnpm --filter @krill/api typecheck` (OK)

### 6. Cierre
- [ ] Pregunta al usuario antes de marcar la tarea del backlog como completada.
- [ ] Mueve los archivos de tarea a `agents/task/archive/` después de la aprobación del usuario.

## Estados Alcanzados
- [x] Implementado
- [x] Validado
- [ ] Cerrado
