# Registros de Decisiones de Arquitectura

Registro de ADR para decisiones duraderas que deben guiar el trabajo futuro.

Antes de planificar el trabajo de producto, lee los ADR aceptados relevantes y no los contradigas en silencio.

Registra solo decisiones con impacto futuro. Mantén decisiones puntuales, soluciones temporales, suposiciones locales de tarea y detalles de codificación obvios en el plan/lista de verificación de la tarea.

Antes de agregar o cambiar un ADR, pide aprobación al usuario y resume el título, contexto, decisión, consecuencias y valor futuro.

Si el trabajo nuevo entra en conflicto con un ADR aceptado, explica el conflicto y pregunta si mantenerlo, reescribirlo o actualizarlo.

## Estados
- `accepted`: aprobado por el usuario y activo para trabajo futuro.
- `rejected`: considerado y rechazado explícitamente; consérvalo solo cuando recordar el rechazo evita debates repetidos.

## Formato

```md
## ADR-000: Título corto
Fecha: YYYY-MM-DD
Estado: accepted | rejected
Contexto: ¿Qué incertidumbre recurrente, restricción o compensación forzó la decisión? ¿Qué opciones importaban?
Decisión: ¿Qué regla debe seguir el trabajo futuro? Sé lo suficientemente específico para que otro agente pueda aplicarla.
Consecuencias: ¿Qué beneficios, costos, restricciones o trabajo derivado genera esto?
```

## Registro
