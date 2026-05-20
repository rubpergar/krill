# Plan de Tarea

## Estado
`aprobado`

## Tarea
- ID: TASK-008
- Título: Implementar tests principales de API, usuario, admin y permisos
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Completar la cobertura de tests de API cubriendo los huecos identificados tras TASK-001 a TASK-007: casos borde de autenticación (tokens expirados, rotación de refresh), filtros admin faltantes, casos borde de paginación, path de error 500, y un test de integración E2E completo que ejercite el flujo usuario+admin. Todo en el layer de API (`apps/api/src/`), sin cambios de comportamiento.

## Alcance

**Incluye:**

1. **Tokens expirados** (auth middleware + endpoints): test que genera token con `exp` en el pasado y verifica 401 en `requireAuth` y en `GET /auth/me`.
2. **Refresh token rotation**: test que confirma que después de un refresh exitoso el token anterior queda invalidado (reuse prevention).
3. **500 Internal Server Error**: test que fuerza un error no manejado para verificar que el `onError` handler global responde con 500.
4. **Filtros admin de incidencias**: tests para `GET /api/v1/admin/incidents` con `?status=`, `?priority=`, `?created_by=`, y combinaciones.
5. **Casos borde de paginación**: tests para `?page=0`, `?page=-1`, `?page=999` (más allá del total), `?limit=0`.
6. **Asignación de incidencias (admin)**: tests para asignar a usuario inexistente, desasignar (enviar `assignedTo: null`), re-asignar.
7. **Actualizar status/priority en incidencia inexistente**: test para `PATCH */:id/status` y `PATCH */:id/priority` con `id` que no existe.
8. **Test E2E completo**: flujo `register (user) → login → crear incidencia → listar → register (admin) → login admin → listar admin → filtrar admin → cambiar status → cambiar prioridad → asignar`.

**Excluye (explícitamente excluido):**
- Tests de frontend (web) o E2E con navegador
- Tests de seguridad ofensiva (XSS, SQL injection, algorithm confusion)
- Tests de rendimiento / carga
- Cambios en comportamiento del producto, API, base de datos o documentación de API
- Tests de eliminación de incidencias (no hay endpoints DELETE implementados)

## Comportamiento Actual
- 62 tests API existentes cubren los flujos principales
- Faltan: tokens expirados, refresh rotation, 500 error, filtros admin, paginación borde, assign borde, E2E completo

## Comportamiento Esperado
- Cobertura de tests API > 80 tests totales (62 actuales + ~18-22 nuevos)
- Todos los casos borde de auth cubiertos: token expirado (middleware y endpoint), refresh rotation
- Filtros admin functionalmente probados: status, priority, created_by, combinados
- Paginación robusta: casos límite de page/limit manejados sin errores
- Assign: casos de usuario inexistente, desasignación, re-asignación
- Error 500: handler global probado
- Un test E2E completo que cubre el journey usuario + admin

## Criterios de Aceptación

1. Test: token expirado en `requireAuth` retorna 401.
2. Test: token expirado en `GET /auth/me` retorna 401.
3. Test: refrescar token dos veces con el mismo refresh token (reutilización) retorna 401.
4. Test: error no manejado (500) en handler global responde con `{ error: "Internal server error" }` y status 500.
5. Test: `GET /admin/incidents?status=open` filtra correctamente (solo devuelve incidencias abiertas).
6. Test: `GET /admin/incidents?priority=high` filtra correctamente.
7. Test: `GET /admin/incidents?created_by=<id>` filtra por creador.
8. Test: `GET /admin/incidents?status=open&priority=high` combina filtros.
9. Test: `?page=0` en listados retorna página 1 (o trata como default).
10. Test: `?page=999` más allá del total retorna array vacío y total correcto.
11. Test: `?page=-1` no causa error 500 (se trata como inválido o default).
12. Test: asignar incidencia a usuario inexistente retorna 400 o 404 (no 500).
13. Test: `assignedTo: null` desasigna correctamente.
14. Test: re-asignar incidencia ya asignada funciona correctamente.
15. Test: cambiar status de incidencia inexistente retorna 404.
16. Test: cambiar priority de incidencia inexistente retorna 404.
17. Test: E2E completo — register user → login → create → list → register admin → login admin → list admin → filter → update status → update priority → assign.

## Casos Borde
- Token expirado: usar `exp` en pasado, verificar 401 no 500.
- Refresh rotation: el token original debe fallar tras un refresh exitoso (seguridad).
- Page=0: debe tratarse como 1 o como inválido, nunca como error 500.
- Page negativa: debe sanitizarse a 1 o rechazarse con 400.
- Asignar a ID inexistente: la validación debe ocurrir antes de persistir.
- Desasignar: `assignedTo: null` debe limpiar el campo en BD.
- Status/priority en incidencia inexistente: 404, no 500.

## Supuestos / Riesgos
- No se modificará comportamiento del producto — solo se añaden tests que validan el comportamiento existente.
- Los tests existentes no deben romperse.
- La base de datos en memoria (`:memory:`) es suficiente para todos los tests.

## Impacto en Base de Datos
No aplica. Solo tests.

## Preguntas Abiertas
- (ninguna)

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md` (para confirmar contratos)

## Registros de Decisiones
- ADRs leídos de `agents/docs/decisions.md`: No hay ADRs registrados aún.
- Nuevas decisiones a registrar después de la aprobación del usuario: Ninguna.
