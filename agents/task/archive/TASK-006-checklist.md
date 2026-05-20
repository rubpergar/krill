# Lista de Verificación TASK-006

## Fuente
- Tarea: TASK-006
- Plan: `agents/task/TASK-006-plan.md`

## Lista de Verificación

### 1. Contexto
- [x] Plan aprobado y docs leídos

### 2. Registro TDD

#### 2.1 Repositorio (nuevas consultas admin)
- [x] RED: Tests escritos (indirectos vía route)
- [x] GREEN: `findAllIncidents`, `updateIncidentStatus`, `updateIncidentPriority`, `assignIncident`

#### 2.2 Servicio admin
- [x] GREEN: `admin-incidents.service.ts` con operaciones admin

#### 2.3 Rutas admin/incidents
- [x] RED: Tests:
  1. GET list todas las incidencias (admin) → 200
  2. GET list filtra por status
  3. GET detail → 200
  4. GET detail inexistente → 404
  5. PATCH status válido → 200
  6. PATCH status inválido → 400
  7. PATCH priority válido → 200
  8. PATCH assign sin body → asigna admin autenticado
  9. PATCH assign a otro admin → 200
  10. Ruta admin sin token → 401
  11. Ruta admin con token de user normal → 403
- [x] GREEN: Implementar routes + service + repository

### 3. Documentos
- [x] `agents/docs/api.md` actualizado

### 4. Validación
- [x] Tests completos: `pnpm --filter @krill/api run test -- --run`
- [x] Lint + typecheck

### 5. Cierre
- [ ] Preguntar usuario
- [ ] Archivar

## Estados
- [x] Implementado
- [x] Validado
- [ ] Cerrado
