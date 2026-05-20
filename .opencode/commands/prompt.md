---
description: Convert a rough request into an optimized prompt only
---

Genera un prompt optimizado a partir de la solicitud en bruto del usuario.

Solicitud en bruto: `$ARGUMENTS`

Goal:
- Transforma una instrucción vaga o corta en un prompt de alta calidad que ayude a un agente a producir mejores resultados.
- Infiere el rol experto más útil automáticamente a partir de la tarea en lugar de pedir al usuario que lo defina manualmente.
- Preserva la intención del usuario mientras agregas estructura, restricciones, criterios de calidad faltantes y una salida esperada más clara.
- Devuelve solo el prompt optimizado. No lo ejecutes.

Si `$ARGUMENTS` está vacío, pide al usuario la idea o tarea en bruto que quiere convertir en un prompt.

Rules:
- Este comando nunca ejecuta la tarea. Su único trabajo es generar el prompt optimizado.
- Infiere el tipo de tarea principal a partir de la solicitud. Las categorías típicas incluyen: arquitectura, implementación, depuración, revisión de código, refactorización, pruebas, documentación, aprendizaje, automatización, análisis y planificación.
- Elige un rol experto principal que mejor se adapte a la tarea. Usa un rol concreto, no uno genérico. Ejemplos: `software architect`, `senior TypeScript backend engineer`, `debugging specialist`, `security reviewer`, `technical writer`, `QA automation engineer`.
- Si la solicitud mezcla múltiples objetivos, mantén un rol principal y menciona perspectivas secundarias solo cuando mejoren materialmente el resultado.
- Agrega estructura faltante al prompt cuando sea útil: rol, objetivo, contexto, entradas, restricciones, formato de salida, criterios de aceptación y cláusula de aclaración.
- Usa instrucciones positivas y directas.
- Aumenta la especificidad. Reemplaza redacción genérica con expectativas concretas siempre que la solicitud ya las implique.
- No inventes hechos técnicos que el usuario no proporcionó. Cuando falte contexto crítico, infiere de forma segura desde la solicitud o inserta marcadores de posición explícitos como `[completa este dato]`.
- Prefiere prompts que sean accionables y orientados a la producción sobre prompts académicos o verbosos.
- Evita relleno, texto motivacional y declaraciones genéricas como `sé preciso` a menos que vayan seguidas de un requisito concreto.
- No reveles razonamiento oculto ni cadena de pensamiento. Devuelve solo el resultado útil.

Role selection guide:
- Architecture/system design -> `senior software architect`
- Build or code generation -> `senior [language/framework] engineer`
- Debugging/bug fixing -> `debugging specialist` o `senior troubleshooting engineer`
- Code review -> `senior code reviewer`
- Refactor/performance -> `performance and clean code engineer`
- Testing -> `QA automation engineer`
- Documentation -> `technical writer`
- Security-sensitive request -> `application security reviewer`
- Unknown or mixed technical request -> `senior software engineer`

Output format:
1. `Rol recomendado:` una línea.
2. `Prompt optimizado:` un solo bloque de código delimitado que contenga el prompt final.
3. `Suposiciones o huecos:` solo si hay detalles faltantes importantes que el usuario debería completar.

Prompt construction requirements:
- Comienza el prompt con el rol seleccionado.
- Expresa la tarea exacta en 1-2 líneas.
- Incluye contexto relevante de la solicitud del usuario.
- Agrega expectativas de entrega concretas cuando sea apropiado, por ejemplo:
  - separa el código por archivo
  - explica los trade-offs
  - incluye casos borde
  - preserva el comportamiento existente
  - incluye pasos de validación
  - haz preguntas aclaratorias antes de asumir información crítica faltante
- Adapta el formato de respuesta a la tarea. Ejemplos:
  - generación de código -> archivos + pasos de prueba
  - depuración -> causas probables + causa raíz + solución + prevención
  - revisión -> hallazgos ordenados por severidad
  - arquitectura -> stack + estructura + modelo de datos + riesgos
  - pruebas -> escenarios + mocks + resumen de cobertura
  - documentación -> estructura de README/API/docs
- Cuando la solicitud ya contenga restricciones sólidas, manténlas y afínalas.
- Cuando la solicitud sea débil o amplia, agrega restricciones prácticas que mejoren la calidad de la respuesta sin cambiar el objetivo original.

Quality bar for the optimized prompt:
- Specific
- Executable
- Unambiguous
- Context-aware
- Output-oriented
- Safe against invented assumptions

Flow:
1. Lee `$ARGUMENTS` e identifica la tarea subyacente.
2. Infiere el mejor rol experto.
3. Extrae el contexto explícito, las restricciones y la salida deseada.
4. Agrega la estructura faltante que mejoraría materialmente el prompt.
5. Devuelve el prompt optimizado en el formato requerido.
