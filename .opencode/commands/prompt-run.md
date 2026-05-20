---
description: Convert a rough request into an optimized prompt and then execute it
---

Toma la solicitud en bruto del usuario, mejórala para convertirla en un prompt más sólido y luego ejecuta ese prompt optimizado en el mismo comando.

Solicitud en bruto: `$ARGUMENTS`

Si `$ARGUMENTS` está vacío, pide al usuario la tarea en bruto que quiere mejorar y ejecutar.

Objectives:
- Infiere el rol experto más útil automáticamente a partir de la solicitud.
- Reescribe la solicitud en un prompt más claro, más específico y más efectivo.
- Ejecuta el prompt optimizado inmediatamente después de construirlo.
- Muestra el prompt optimizado antes o junto al resultado de la ejecución para que el usuario pueda reutilizarlo más tarde.

Rules:
- Primero optimiza, luego ejecuta. No omitas el paso de optimización.
- Preserva la intención original del usuario. Mejora claridad, estructura, restricciones y salida esperada sin cambiar el objetivo real.
- Usa un rol experto principal que mejor se adapte a la tarea.
- No inventes hechos del proyecto, APIs, archivos o restricciones técnicas. Si faltan datos críticos, pregunta antes de ejecutar.
- Si la solicitud es demasiado ambigua o riesgosa para ejecutar de forma segura, detente después de explicar qué información falta.
- Usa instrucciones positivas, directas y orientadas a la producción.
- No reveles razonamiento oculto ni cadena de pensamiento.

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
2. `Prompt optimizado:` un solo bloque de código delimitado que contenga el prompt final optimizado que se ejecutará.
3. `Ejecucion:` ejecuta ese prompt optimizado inmediatamente después de presentarlo.
4. `Suposiciones o huecos:` solo si faltan detalles importantes y la ejecución no puede continuar de forma segura.

Prompt construction requirements:
- Comienza el prompt optimizado con el rol seleccionado.
- Expresa la tarea exacta en 1-2 líneas.
- Incluye contexto relevante de la solicitud del usuario.
- Agrega expectativas de entrega concretas cuando sea apropiado.
- Adapta el formato de respuesta a la tarea.
- Preserva las restricciones sólidas ya presentes en la solicitud.
- Si la solicitud es amplia, agrega restricciones prácticas que mejoren la calidad de la respuesta sin cambiar la intención.

Execution requirements:
- Después de construir el prompt optimizado, úsalo como la instrucción real para completar la tarea.
- Sigue las reglas del repositorio, los límites de archivos y las restricciones de seguridad durante la ejecución.
- Si la ejecución requiere aclaración, pregunta antes de hacer suposiciones.

Flow:
1. Lee `$ARGUMENTS` e identifica la tarea real.
2. Infiere el mejor rol experto.
3. Construye el prompt optimizado.
4. Presenta el prompt optimizado.
5. Ejecútalo inmediatamente.
