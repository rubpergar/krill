---
description: Quick implementation without SDD/TDD for trivial changes
---

Implementa un cambio directamente, omitiendo el flujo completo de SDD (backlog, plan, checklist, TDD).

Cambio solicitado: `$ARGUMENTS`

Rules:
- Este modo solo aplica a cambios que cumplan TODOS los criterios de elegibilidad a continuación.
- Debes explicar brevemente por qué el cambio califica antes de implementarlo.
- Implementa el cambio mínimo necesario — sin refactorizaciones o mejoras adicionales.
- Si durante la ejecución el cambio resulta ser ambiguo, riesgoso o tiene impacto en el comportamiento, DETENTE y explica que debería seguir el flujo normal de SDD.
- Si `$ARGUMENTS` está vacío, pregunta qué quiere cambiar el usuario.
- Al final, indica que se usó el modo FAST y qué validación mínima se realizó (ej. el archivo fue escrito, la sintaxis es válida).

Elegibilidad: el cambio DEBE cumplir TODAS las condiciones:
- Pequeño y reversible
- Sin impacto en el comportamiento funcional
- Bajo riesgo
- NO toca API, BD, auth, pagos o seguridad

Cambios permitidos:
- Correcciones tipográficas en documentación
- Cambios de copia no funcionales
- Ajustes de comentarios
- Formateo no conductual
- Actualizaciones menores de documentación interna

NO permitidos:
- Cambios de comportamiento
- Correcciones de bugs funcionales
- Refactorizaciones riesgosas
- Cambios en API, BD, auth, pago o seguridad
- Cambios de UI que afecten accesibilidad o comportamiento

Flow:
1. Lee `$ARGUMENTS` y determina si el cambio califica para modo FAST.
2. Si califica, explica por qué e implementa directamente.
3. Si no califica, explica por qué y sugiere usar el flujo normal de SDD.
4. Si aparece ambigüedad o riesgo durante la implementación, detente y escala a SDD.
5. Cuando termines, reporta para qué se usó el modo FAST y qué validación se realizó.
