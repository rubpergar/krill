# TASK-004 Plan: Implementar creación, validación y persistencia de incidencias

## Status
`approved`

## Task
- ID: TASK-004
- Title: Implementar creación, validación y persistencia de incidencias
- Backlog source: `agents/task/backlog.md`

## Summary
Mejorar la validación de creación de incidencias (longitud mínima/máxima de campos) e implementar la máquina de estados para las transiciones de status que quedó diferida de TASK-003.

## Scope

**In:**
- Title: min 3, max 200 chars (Zod schema)
- Description: min 1, max 2000 chars (Zod schema)
- Máquina de estados para `status` con transiciones válidas
- Transición inválida → error `INVALID_STATUS_TRANSITION` (400)
- Transición al mismo status → permitido (no-op)
- Tests para nuevas validaciones y transiciones
- Actualizar `agents/db/domain.md` con reglas de estado

**Out (explicitamente excluido):**
- Paginación/filtros — TASK-005
- Admin management avanzado — TASK-006
- DB persistence real — se mantiene in-memory
- Frontend — TASK-007
- E2E tests — TASK-008

## Current Behavior
- Title y description aceptan cualquier longitud >= 1
- `updateStatus` permite cualquier transición sin validación
- No hay concepto de estado de máquina de estados

## Target Behavior
- Title validado entre 3-200 caracteres
- Description validado entre 1-2000 caracteres
- `updateStatus` rechaza transiciones inválidas con 400
- Transiciones permitidas documentadas en domain.md

### Estado machine
```
open ──────────► in_progress ──► resolved ──► closed
  ▲                  ▲                │
  └──────────────────┴────────────────┘ (reabrir)
```

| Desde | Hacia válido |
|---|---|
| `open` | `in_progress`, `resolved`, `closed` |
| `in_progress` | `open`, `resolved` |
| `resolved` | `open`, `in_progress`, `closed` |
| `closed` | `open` |

## Acceptance Criteria
- `POST /incidents` con title < 3 chars → 400
- `POST /incidents` con title > 200 chars → 400
- `POST /incidents` con description > 2000 chars → 400
- `PATCH /incidents/:id/status` con transición inválida → 400 `INVALID_STATUS_TRANSITION`
- `PATCH /incidents/:id/status` con transición válida → 200
- `PATCH /incidents/:id/status` con mismo status → 200
- Tests pasan, lint/typecheck/build OK

## Edge Cases
- Title de exactamente 3 chars → válido
- Title de exactamente 200 chars → válido
- Description de exactamente 2000 chars → válido
- Transición `open → closed` → válida (cierre directo)
- Transición `in_progress → closed` → inválida (debe pasar por resolved)
- Transición `closed → in_progress` → inválida (debe reabrirse a open)

## Assumptions / Risks
- La máquina de estados se define en el service, no en la base de datos
- No hay cascada de cambios a otras entidades
- Los tests existentes deben seguir pasando después de los cambios

## Database Impact
Not applicable — se mantiene almacenamiento in-memory.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: none
- New decisions to record after user approval: ninguno
