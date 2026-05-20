# Task Plan TASK-008

## Status
`draft`

## Task
- ID: TASK-008
- Title: Implementar tests principales de API, usuario, admin y permisos
- Backlog source: `agents/task/backlog.md`

## Summary
Actualmente hay 81 tests en backend (auth + roles + incidents/comments/admin) y solo 1 placeholder en frontend. Se añadirán tests de integración que cubren flujos completos de usuario (registro → login → CRUD incidencias → comentarios → estados), flujos admin, casos borde de validación, y tests unitarios para lógica pura del service (filtros, state machine, paginación). También se agregarán tests básicos de frontend para el API service layer.

## Scope

**In:**
1. **Test de flujo completo usuario**: register → login → crear incidencia → listar → ver detalle → añadir comentario → cambiar estado → cambiar prioridad → logout
2. **Test de flujo admin**: admin listar todas → admin ver cualquier detalle → admin cambiar estado any → admin cambiar prioridad any → admin comentar any
3. **Test de trimming**: título/descripción con espacios alrededor se recortan
4. **Test de unitarios del service**: `applyFiltersAndPaginate` (filtros, paginación), `VALID_TRANSITIONS` (estados válidos e inválidos)
5. **Test de frontera de enums**: todas las combinaciones de category × priority en creación
6. **Test de frontera de fechas**: dateFrom/dateTo en admin list
7. **Test de frontend**: API service layer — mock de fetch para login, getMe, error handling
8. **Limpieza**: eliminar `placeholder.test.ts` de backend y frontend (reemplazados por tests reales)

**Out (explicitly excluded):**
- Tests de componentes visuales (TASK futura)
- Tests E2E con navegador real
- Coverage thresholds
- Tests de frontend para páginas/componentes

## Current Behavior
- Backend: 81 tests (auth 11, roles 5, incidents 64, placeholder 1)
- Frontend: 1 placeholder test
- Sin tests de flujo completo (solo endpoints aislados)
- Sin tests unitarios puros para lógica de service
- Sin tests de frontend

## Target Behavior
- Backend: ~95-100 tests cubriendo flujos principales, unitarios de service, edge cases
- Frontend: ~10 tests para API service layer con fetch mockeado
- Placeholder tests eliminados

## Acceptance Criteria
1. Flujo completo usuario funciona de register a cambio de estado
2. Flujo completo admin puede operar sobre cualquier incidencia
3. Título con espacios se almacena sin espacios (trim)
4. `applyFiltersAndPaginate` filtra por status, priority, category, dateFrom/dateTo correctamente
5. `VALID_TRANSITIONS` acepta/rechaza transiciones correctamente
6. Todas las combinaciones category × priority se crean sin error
7. Admin list con dateFrom/dateTo filtra correctamente
8. Frontend api.ts login devuelve token, getMe devuelve user, error 401 lanza ApiError
9. Placeholder tests eliminados

## Edge Cases
- Flujo con token expirado (simulado con token inválido en el medio)
- Admin comentando incidencia de otro usuario (debe funcionar)
- Transition `closed → closed` permitido (no-op)
- Transition `open → closed` permitido ok

## Assumptions / Risks
- Los tests se añaden a los archivos existentes (incidents.test.ts, auth.test.ts) o se crean nuevos archivos si es necesario (flows.test.ts, service.test.ts)
- Los tests de frontend usan `vitest` + `vi.fn()` para mockear fetch
- El backend se testea con `app.inject()` (sin servidor HTTP real)

## Database Impact
Not applicable — no DB.

## Open Questions
Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None
- New decisions to record after user approval: None
