---
description: Convierte una solicitud preliminar en un prompt optimizado y luego lo ejecuta
---

Toma la solicitud original del usuario, mejórala para convertirla en un prompt más sólido y luego ejecuta ese prompt optimizado en el mismo comando.

Solicitud original: `$ARGUMENTS`

Si `$ARGUMENTS` está vacío, pide al usuario la tarea original que desea mejorar y ejecutar.

Objetivos:
- Deducir automáticamente el rol experto más útil a partir de la solicitud.
- Reformular la solicitud en un prompt más claro, específico y eficaz.
- Ejecutar el prompt optimizado inmediatamente después de construirlo.

Reglas:
- Primero optimizar, luego ejecutar. No omitas el paso de optimización.
- Conserva la intención original del usuario. Mejora la claridad, estructura, restricciones y salida esperada sin cambiar el objetivo real.
- Usa un único rol experto principal que mejor se ajuste a la tarea.
- No inventes hechos del proyecto, APIs, archivos ni restricciones técnicas. Si faltan datos críticos, pregunta antes de ejecutar.
- Si la solicitud es demasiado ambigua o arriesgada para ejecutarla de forma segura, detente después de explicar qué información falta.
- Usa instrucciones positivas, directas y orientadas a la producción.
- No reveles razonamientos ocultos ni cadenas de pensamiento.

Guía de selección de rol:
- Arquitectura/diseño de sistemas -> `senior software architect`
- Construcción o generación de código -> `senior [language/framework] engineer`
- Depuración/corrección de errores -> `debugging specialist` o `senior troubleshooting engineer`
- Revisión de código -> `senior code reviewer`
- Refactorización/rendimiento -> `performance and clean code engineer`
- Pruebas -> `QA automation engineer`
- Documentación -> `technical writer`
- Solicitud de seguridad -> `application security reviewer`
- Solicitud técnica mixta o desconocida -> `senior software engineer`

Formato de salida:
1. `Execution:` ejecuta el prompt optimizado inmediatamente. No reveles el prompt optimizado.
2. `Assumptions or gaps:` solo si faltan detalles importantes y la ejecución no puede continuar de forma segura.

Requisitos de construcción del prompt:
- Comienza el prompt optimizado con el rol seleccionado.
- Indica la tarea exacta en 1-2 líneas.
- Incluye el contexto relevante de la solicitud del usuario.
- Añade expectativas concretas de entrega cuando sea apropiado.
- Adapta el formato de respuesta a la tarea.
- Conserva las restricciones sólidas ya presentes en la solicitud.
- Si la solicitud es amplia, añade restricciones prácticas que mejoren la calidad de la respuesta sin cambiar la intención.

Requisitos de ejecución:
- Después de construir el prompt optimizado, úsalo como la instrucción real para completar la tarea.
- Sigue las reglas del repositorio, los límites de archivos y las restricciones de seguridad durante la ejecución.
- Si la ejecución requiere aclaración, pregunta antes de asumir.

Flujo:
1. Lee `$ARGUMENTS` e identifica la tarea real.
2. Deduce el mejor rol experto.
3. Construye el prompt optimizado (omite mostrarlo para ahorrar tokens).
4. Ejecútalo inmediatamente.
