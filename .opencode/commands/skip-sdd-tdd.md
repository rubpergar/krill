---
description: Implementación rápida sin SDD/TDD para cambios triviales
---

Implementa un cambio directamente, omitiendo el flujo de trabajo SDD completo (backlog, plan, checklist, TDD).

Cambio solicitado: `$ARGUMENTS`

Reglas:
- Este modo solo aplica a cambios que cumplan TODOS los criterios de elegibilidad siguientes.
- Debes explicar brevemente por qué el cambio califica antes de implementar.
- Implementa el cambio mínimo necesario — sin refactorizaciones o mejoras extra.
- Si durante la ejecución el cambio resulta ambiguo, riesgoso o tiene impacto en el comportamiento, DETENTE y explica que debería seguir el flujo SDD normal.
- Si `$ARGUMENTS` está vacío, pregunta qué quiere cambiar el usuario.
- Al final, indica que se usó el modo FAST y qué validación mínima se realizó (ej. el archivo fue escrito, la sintaxis es válida).

Elegibilidad — el cambio DEBE cumplir TODAS las condiciones:
- Pequeño y reversible
- Sin impacto funcional en el comportamiento
- Bajo riesgo
- NO toca API, BD, auth, pagos ni seguridad

Cambios permitidos:
- Correcciones tipográficas en documentación
- Cambios de copia no funcionales
- Ajustes de comentarios
- Formateo no funcional
- Actualizaciones menores de documentación interna

NO permitidos:
- Cambios de comportamiento
- Correcciones funcionales de errores
- Refactorizaciones riesgosas
- Cambios en API, BD, auth, pagos o seguridad
- Cambios de UI que afecten accesibilidad o comportamiento

Flujo:
1. Lee `$ARGUMENTS` y determina si el cambio califica para modo FAST.
2. Si califica, explica por qué e implementa directamente.
3. Si no califica, explica por qué y sugiere usar el flujo SDD normal.
4. Si aparece ambigüedad o riesgo a mitad de la implementación, detente y escala a SDD.
5. Al terminar, reporta para qué se usó el modo FAST y qué validación se realizó.
