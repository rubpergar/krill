---
description: Convertir una solicitud preliminar en un prompt optimizado únicamente
---

Genera un prompt optimizado a partir de la solicitud en bruto del usuario.

Solicitud en bruto: `$ARGUMENTS`

Objetivo:
- Transformar una instrucción vaga o corta en un prompt de alta calidad que ayude a un agente a producir mejores resultados.
- Inferir el rol experto más útil automáticamente a partir de la tarea en lugar de pedir al usuario que lo defina manualmente.
- Preservar la intención del usuario mientras se añade estructura, restricciones, criterios de calidad faltantes y una salida esperada más clara.
- Devolver solo el prompt optimizado. No ejecutarlo.

Si `$ARGUMENTS` está vacío, pide al usuario la idea o tarea en bruto que quiere convertir en un prompt.

Reglas:
- Este comando nunca ejecuta la tarea. Su única función es generar el prompt optimizado.
- Infiere el tipo de tarea principal a partir de la solicitud. Las categorías típicas incluyen: arquitectura, implementación, depuración, revisión de código, refactorización, testing, documentación, aprendizaje, automatización, análisis y planificación.
- Elige un rol experto principal que mejor se ajuste a la tarea. Usa un rol concreto, no uno genérico. Ejemplos: `software architect`, `senior TypeScript backend engineer`, `debugging specialist`, `security reviewer`, `technical writer`, `QA automation engineer`.
- Si la solicitud combina múltiples objetivos, mantén un rol principal y menciona perspectivas secundarias solo cuando mejoren materialmente el resultado.
- Añade estructura de prompt faltante cuando sea útil: rol, objetivo, contexto, entradas, restricciones, formato de salida, criterios de aceptación y cláusula de aclaración.
- Usa instrucciones positivas y directas.
- Aumenta la especificidad. Reemplaza redacción genérica con expectativas concretas siempre que la solicitud ya las implique.
- No inventes hechos técnicos que el usuario no haya proporcionado. Cuando falte contexto crítico, infiérelo de manera segura a partir de la solicitud o inserta placeholders explícitos como `[completa este dato]`.
- Prefiere prompts que sean accionables y orientados a la producción sobre prompts académicos o verbosos.
- Evita relleno, texto motivacional y declaraciones genéricas como `be precise` a menos que vayan seguidas de un requisito concreto.
- No reveles razonamiento oculto ni cadena de pensamiento. Devuelve solo el resultado útil.

Guía de selección de rol:
- Arquitectura/diseño de sistemas -> `senior software architect`
- Construcción o generación de código -> `senior [language/framework] engineer`
- Depuración/corrección de errores -> `debugging specialist` o `senior troubleshooting engineer`
- Revisión de código -> `senior code reviewer`
- Refactorización/rendimiento -> `performance and clean code engineer`
- Testing -> `QA automation engineer`
- Documentación -> `technical writer`
- Solicitud sensible a seguridad -> `application security reviewer`
- Solicitud técnica desconocida o mixta -> `senior software engineer`

Formato de salida:
1. `Recommended role:` una línea.
2. `Optimized prompt:` un solo bloque de código delimitado que contenga el prompt final.
3. `Assumptions or gaps:` solo si hay detalles importantes faltantes que el usuario deba completar.

Requisitos de construcción del prompt:
- Comienza el prompt con el rol seleccionado.
- Indica la tarea exacta en 1-2 líneas.
- Incluye contexto relevante de la solicitud del usuario.
- Añade expectativas de entrega concretas cuando sea apropiado, por ejemplo:
  - código separado por archivo
  - explicar compensaciones
  - incluir casos extremos
  - preservar comportamiento existente
  - incluir pasos de validación
  - hacer preguntas aclaratorias antes de asumir información crítica faltante
- Adapta el formato de respuesta a la tarea. Ejemplos:
  - generación de código -> archivos + pasos de test
  - depuración -> causas probables + causa raíz + solución + prevención
  - revisión -> hallazgos ordenados por severidad
  - arquitectura -> stack + estructura + modelo de datos + riesgos
  - testing -> escenarios + mocks + resumen de cobertura
  - documentación -> estructura de README/API/docs
- Cuando la solicitud ya contenga restricciones sólidas, mantenlas y afínalas.
- Cuando la solicitud sea débil o amplia, añade restricciones prácticas que mejoren la calidad de la respuesta sin cambiar el objetivo original.

Estándar de calidad para el prompt optimizado:
- Específico
- Ejecutable
- Inequívoco
- Consciente del contexto
- Orientado a la salida
- Seguro contra suposiciones inventadas

Flujo:
1. Lee `$ARGUMENTS` e identifica la tarea subyacente.
2. Infiere el mejor rol experto.
3. Extrae el contexto explícito, las restricciones y la salida deseada.
4. Añade la estructura faltante que mejoraría materialmente el prompt.
5. Devuelve el prompt optimizado en el formato requerido.
