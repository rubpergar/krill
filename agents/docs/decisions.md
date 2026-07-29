# Registros de Decisiones Arquitectónicas (Architecture Decision Records)

Registro ADR para decisiones duraderas que deben guiar el trabajo futuro.

Antes de planificar trabajo de producto, leer los ADR aceptados relevantes y no contradecirlos silenciosamente.

Registrar solo decisiones con impacto futuro. Mantener las decisiones puntuales, soluciones temporales, suposiciones locales a la tarea y detalles de codificación obvios en el plan/checklist de la tarea.

Antes de agregar o cambiar un ADR, pedir aprobación al usuario y resumir el título, contexto, decisión, consecuencias y valor futuro.

Si el trabajo nuevo entra en conflicto con un ADR aceptado, explicar el conflicto y preguntar si mantenerlo, reescribirlo o actualizarlo.

## Estados
- `accepted`: aprobado por el usuario y activo para trabajo futuro.
- `rejected`: considerado y explícitamente rechazado; conservar solo cuando recordar el rechazo evita debates repetidos.

## Formato

```md
## ADR-000: Título breve
Fecha: YYYY-MM-DD
Estado: accepted | rejected
Contexto: ¿qué incertidumbre recurrente, restricción o trade-off obligó a tomar la decisión? ¿Qué opciones eran relevantes?
Decisión: ¿qué regla debe seguir el trabajo futuro? Sé lo bastante específico para que otro agente pueda aplicarla.
Consecuencias: ¿qué beneficios, costes, restricciones o trabajo posterior crea esta decisión?
```

## Registro
