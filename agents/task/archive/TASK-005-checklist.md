# Lista de Verificación TASK-005

## Fuente
- Tarea: TASK-005
- Plan: `agents/task/TASK-005-plan.md`

## Lista de Verificación

### 1. Contexto
- [x] Plan aprobado y docs leídos
- [x] TDD skill cargada

### 2. Registro TDD

#### 2.1 Repositorio (consultas)
- [x] RED: Tests escritos (indirectos vía route)
- [x] GREEN: `findIncidentsByUserId` con paginación y filtros
- [x] GREEN: `findIncidentByIdAndUserId`

#### 2.2 Servicio
- [x] RED: Tests escritos (indirectos vía route)
- [x] GREEN: `listUserIncidents` y `getIncidentDetail`

#### 2.3 Rutas GET
- [x] RED: Tests lista (10):
  1. Listar incidencias del usuario autenticado
  2. Listar sin token → 401
  3. Listar con paginación correcta
  4. Listar con limit=1 retorna 1
  5. Usuario sin incidencias → array vacío
  6. Filtrar por status
  7. Detalle con id válido y dueño → 200
  8. Detalle con id inexistente → 404
  9. Detalle de incidencia de otro usuario → 404
  10. Detalle sin token → 401
- [x] GREEN: Implementar routes + repository + service

### 3. Documentos
- [x] `agents/docs/api.md` actualizado

### 4. Validación
- [x] Suite completa: `pnpm --filter @krill/api run test -- --run`
- [x] Lint: `pnpm --filter @krill/api run lint`
- [x] Typecheck: `pnpm --filter @krill/api run typecheck`
- [x] Build: `pnpm --filter @krill/api run build`

### 5. Cierre
- [ ] Preguntar usuario
- [ ] Archivar

## Estados
- [x] Implementado
- [x] Validado
- [ ] Cerrado
