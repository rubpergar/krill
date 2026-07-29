---
description: Crear o refinar el plan de la tarea activa desde el contexto de la conversación
---

Crea o refina `agents/task/TASK-XXX-plan.md` para la tarea activa usando la discusión de planificación ya desarrollada en la conversación.

Reglas:
- Lee `agents/task/backlog.md` e identifica la tarea única bajo `## Current`.
- Si `## Current` tiene cero o múltiples tareas, detente y pide al usuario que seleccione o cree una.
- Extrae el ID de tarea (TASK-XXX) de la entrada del backlog.
- Lee `agents/task/plan.md` para entender la estructura requerida del plan.
- Lee los ADRs aceptados relevantes de `agents/docs/decisions.md` antes de finalizar decisiones de comportamiento o implementación.
- No asumas que se requiere un modo de agente especial. Este comando debe funcionar correctamente en el modo de trabajo normal.
- Antes de hacer preguntas, inspecciona el conjunto más pequeño útil de archivos y contexto del proyecto necesario para entender la tarea.
- Si el usuario referencia múltiples repositorios, bases de código grandes o documentos de soporte, inspecciónalos primero y paraleliza la exploración cuando sea útil.
- Usa el contexto de la conversación (discusión de planificación, salida de /prompt-run, aclaraciones del usuario) para llenar cada sección de la plantilla del plan.
- No inventes requisitos, APIs, estructuras de BD ni hechos técnicos que no se hayan discutido o confirmado.
- Si falta información crítica en la conversación, enumérala bajo `## Open Questions` en lugar de adivinar.
- Mantén el estado del plan como `draft` mientras la planificación esté en progreso. Cuando no queden preguntas abiertas bloqueantes, pregunta al usuario si el plan está listo para aprobación. Solo después de una respuesta afirmativa explícita puede este comando cambiar el estado a `approved`.
- Crea el plan temprano y refínalo iterativamente. No esperes a que cada pregunta esté respondida antes de escribir el primer borrador.
- Si ya existe un archivo de plan para esta tarea, actualízalo con los nuevos puntos de discusión en lugar de sobrescribir a ciegas.
- Prefiere hacer una pregunta de planificación de alto apalancamiento a la vez.
- Prefiere preguntas de opción basadas en interfaces sobre chat libre siempre que haya alternativas claras.
- Para cada pregunta, presenta opciones concisas, pon la opción recomendada primero, explica la compensación brevemente y deja espacio para una respuesta personalizada cuando sea necesario.
- Después de cada respuesta de planificación, actualiza el borrador del plan inmediatamente para que el archivo se mantenga sincronizado con la conversación.
- Si la tarea afecta la base de datos, llena la sección `## Database Impact` con el enfoque discutido.
- Pobla `## Source of Truth to Read` con archivos relevantes para la tarea.
- Sigue `AGENTS.md` para el flujo de trabajo de planificación canónico y el comportamiento de preguntas de planificación.

Flujo:
1. Lee `agents/task/backlog.md` y confirma exactamente una tarea bajo `## Current`.
2. Lee `agents/task/plan.md` para la estructura de la plantilla.
3. Lee `agents/docs/decisions.md` y los archivos fuente de la verdad relevantes y el contexto referenciado para la tarea activa.
4. Sintetiza el contexto disponible en el mejor borrador de plan actual.
5. Crea o actualiza `agents/task/TASK-XXX-plan.md` con estado `draft`.
6. Pregunta la siguiente pregunta no resuelta de mayor valor.
7. Después de cada respuesta del usuario, actualiza el borrador del plan y continúa hasta que el usuario confirme que el plan está completo.
8. Al hacer una pausa, muestra el progreso actual del plan y las preguntas abiertas restantes que bloquean la aprobación.
9. Cuando no queden preguntas bloqueantes, resume el plan y pregunta si el usuario quiere aprobarlo para implementación.
10. Si el usuario aprueba explícitamente, cambia el estado del plan de `draft` a `approved`. De lo contrario, déjalo como `draft` y continúa planificando o informa los refinamientos restantes.
