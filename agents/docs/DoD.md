# Definición de Hecho (Definition of Done)

Los planes de tarea usan cuatro estados: `draft`, `approved`, `in_progress` y `closed`.

Los criterios siguientes definen qué debe cumplirse mientras una tarea está `in_progress` y qué se requiere antes de pasarla a `closed`.

## En Progreso (In Progress)

El cambio está implementado, validado y listo para el cierre administrativo.

- El plan de tarea coincide con el comportamiento implementado.
- La checklist está completa o explica los elementos no aplicables.
- Las suposiciones, casos borde, cambios de alcance y excepciones de TDD están registrados.
- Los cambios se limitan al alcance del plan aprobado.
- Las interfaces públicas existentes siguen siendo compatibles a menos que el plan indique lo contrario.
- Sin refactorizaciones no relacionadas.
- Sin dependencias innecesarias.
- El comportamiento sensible a la seguridad se modificó solo con cobertura explícita del plan.
- Se agregaron o actualizaron pruebas relevantes.
- La evidencia de TDD o una excepción aprobada está registrada para cambios de comportamiento.
- Las pruebas afectadas pasan.
- Lint/typecheck/build pasan cuando están disponibles y son relevantes.
- Cualquier comando que no pudo ejecutarse se registra con su motivo y riesgo residual.
- La sincronización código-documentación se verificó para los documentos fuente de verdad afectados (ver «Affected Areas» en el plan). Si se encuentran discrepancias, detenerse y preguntar al usuario si actualizar el documento o corregir el código. No continuar hasta resolverlo.
- Los documentos fuente de verdad afectados se actualizaron según las reglas de documentación en `AGENTS.md`.
- Los archivos temporales, registros de depuración, scripts provisionales y artefactos de prueba se limpiaron o promovieron.
- `git status` contiene solo cambios intencionados.

## Cerrado (Closed)

Cerrado administrativamente. El usuario aprobó, los archivos de la tarea están archivados.

- El usuario aprobó la finalización del backlog.
- El estado del plan de tarea se actualizó a `closed` antes de archivar.
- El plan de tarea y la checklist se movieron a `agents/task/archive/` en el mismo paso de cierre.
- Las decisiones duraderas se registraron en el documento fuente de verdad correspondiente con la aprobación del usuario, o se dejaron deliberadamente a nivel de tarea.
