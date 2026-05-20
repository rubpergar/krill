# Definición de Hecho (Definition of Done)

Una tarea pasa por tres estados. Cada estado tiene sus propios criterios. Una tarea puede estar `validated` sin estar `closed`, pero no puede estar `closed` sin estar `validated`.

## Implementada (Implemented)

El cambio está técnicamente listo. Existen pruebas relevantes.

- El plan de la tarea coincide con el comportamiento implementado.
- La lista de verificación está completa o explica los elementos no aplicables.
- Las suposiciones, casos límite, cambios de alcance y excepciones de TDD están registrados.
- Los cambios están dentro del alcance del plan aprobado.
- Las interfaces públicas existentes siguen siendo compatibles a menos que el plan indique lo contrario.
- Sin refactorizaciones no relacionadas.
- Sin dependencias innecesarias.
- El comportamiento sensible a la seguridad se modificó solo con cobertura explícita del plan.

## Validada (Validated)

Las validaciones se aprobaron, o las brechas están documentadas con riesgo residual.

- Se agregaron o actualizaron las pruebas relevantes.
- La evidencia de TDD o la excepción aprobada están registradas para cambios de comportamiento.
- Las pruebas afectadas pasan.
- Lint/verificador de tipos/compilación pasan cuando están disponibles y son relevantes.
- Cualquier comando que no pudo ejecutarse está registrado con motivo y riesgo residual.
- Se verificó la sincronización código-documento para los documentos fuente de verdad afectados (ver plan "Áreas Afectadas"). Si se encuentran discrepancias, detente y pregunta al usuario si actualizar el documento o corregir el código. No continues hasta resolverlo.
- Los documentos fuente de verdad afectados se actualizaron (ver reglas de documentación a continuación).
- Archivos temporales, registros de depuración, scripts de prueba y artefactos de prueba limpiados o promovidos.
- `git status` contiene solo cambios intencionales.

### Reglas de documentación

Sigue el Paso 6 del SDD en `AGENTS.md` — es la fuente canónica para cuándo y cómo actualizar documentos duraderos. Esta sección lo refleja para referencia local durante la validación; si divergen, `AGENTS.md` tiene prioridad.

Actualiza solo cuando el contrato duradero cambie:
- `agents/docs/api.md` para comportamiento de API pública.
- `agents/db/schema.sql` y notas de migración/reversión para esquema de BD.
- `agents/db/domain.md` para reglas de dominio.
- `agents/docs/design.md` para reglas de UI reutilizables.
- `agents/docs/testing.md` para reglas o comandos de validación.
- `agents/docs/decisions.md` solo para ADRs duraderos aprobados por el usuario.
- Las decisiones duraderas identificadas durante la tarea fueron aprobadas y registradas como ADRs, o deliberadamente dejadas en el plan/lista de verificación de la tarea porque el usuario las rechazó o eran locales a la tarea.

## Cerrada (Closed)

Cerrada administrativamente. Usuario aprobó, archivos de tarea archivados.

- El usuario aprobó la finalización en el backlog.
- El plan/lista de verificación de la tarea se movieron a `agents/task/archive/` en el mismo paso de cierre.
