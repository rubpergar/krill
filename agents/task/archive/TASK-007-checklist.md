# Lista de Verificación de Tarea

## Fuente
- Tarea: TASK-007
- Plan: `agents/task/TASK-007-plan.md`

## Reglas
- Trabaja en orden a menos que esté bloqueado.
- Mantén los elementos derivados del plan aprobado.
- Marca los elementos completados solo durante la implementación.

## Lista de Verificación

### 1. Contexto
- [x] Vuelve a leer el plan aprobado y los documentos fuente de verdad referenciados.
- [x] Carga y aplica `agents/skills/test-driven-development/SKILL.md`, o registra por qué no aplica.
- [x] Carga y aplica `agents/skills/interface-design/SKILL.md`.
- [x] Verifica que ninguna pregunta abierta bloquee la implementación.

### 2. Registro TDD

- [x] RED: Test que el componente Button renderiza correctamente → GREEN: implementar Button
- [x] RED: Test que el componente Input renderiza con label → GREEN: implementar Input
- [x] RED: Test que Card, Badge, Skeleton renderizan → GREEN: implementar
- [x] RED: Test que Toast muestra/oculta mensajes → GREEN: implementar Toast + contexto
- [x] RED: Test que api client maneja 401 y refresh → GREEN: implementar api.ts + auth-storage
- [x] RED: Test que AuthContext provee sesión → GREEN: implementar AuthContext + useAuth
- [x] RED: Test que AppLayout muestra navbar contextual → GREEN: implementar AppLayout + BentoGrid
- [x] RED: Test que LoginPage envía credenciales → GREEN: implementar LoginPage
- [x] RED: Test que RegisterPage registra usuario → GREEN: implementar RegisterPage
- [x] RED: Test que DashboardPage muestra bento + lista incidencias → GREEN: implementar DashboardPage
- [x] RED: Test que CreateIncidentPage crea incidencia → GREEN: implementar CreateIncidentPage
- [x] RED: Test que IncidentDetailPage muestra detalle → GREEN: implementar IncidentDetailPage
- [x] RED: Test que AdminDashboardPage lista con filtros → GREEN: implementar AdminDashboardPage
- [x] RED: Test que AdminIncidentDetailPage cambia status/prioridad/asignación → GREEN: implementar AdminIncidentDetailPage

### 3. Alcance y Documentos
- [x] Todos los ciclos TDD completados o documentados como excepciones aprobadas.
- [x] Los cambios se mantuvieron dentro del alcance aprobado. Sin refactorizaciones no relacionadas.
- [ ] Hallazgos fuera de alcance registrados en `agents/docs/debt.md`.
- [ ] Verificación de sincronización: compara el código implementado contra los documentos fuente de verdad afectados del plan.
- [x] Documentos duraderos actualizados (`agents/docs/design.md` con tokens visuales).

### 4. Controles de Cambios de Base de Datos
No aplica.

### 5. Validación (→ validado)
- [x] Pruebas específicas: 15 frontend tests pass
- [x] Suite de pruebas completa: 62 API tests + 15 frontend tests = 77 pass
- [ ] Lint: `pnpm --filter @krill/web lint`
- [x] Verificación de tipos: `pnpm --filter @krill/web typecheck` pass
- [x] Compilación: `pnpm --filter @krill/web build` pass
- [ ] Criterios validados de DoD verificados.

### 6. Cierre (→ cerrado)
- [ ] Pregunta al usuario antes de marcar la tarea del backlog como completada.
- [ ] Mueve los archivos de tarea a `agents/task/archive/` después de la aprobación del usuario.

## Estados Alcanzados
- [x] Implementado (secciones 1-3 completas)
- [ ] Validado (sección 5 completa)
- [ ] Cerrado (sección 6 completa + aprobación del usuario)

## Notas de Reanudación
- Faltó ejecutar lint (pre-existing issue: web lint timeout) y verificar sincronización DoD.
- Deuda técnica: modo oscuro y framer-motion no usados, registrados en design.md excepciones.
