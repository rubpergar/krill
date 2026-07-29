# Deuda Técnica (Technical Debt)

Registro de bugs, incidencias, mejoras o incidentes que el agente encuentra mientras trabaja en una tarea y que están fuera del alcance de la tarea actual.

Cuando el agente encuentra algo relevante pero fuera del alcance, debe registrarlo aquí en lugar de modificarlo sin permiso. El usuario revisa periódicamente el registro y decide si crear una tarea formal.

## Estados
- `open`: pendiente de revisión del usuario.
- `dismissed`: el usuario decidió no abordarlo.

## Formato

```md
## DBT-XXX: Título breve
Fecha: YYYY-MM-DD
Estado: open | dismissed
Riesgo: low | medium | high
Impacto: low | medium | high
Prioridad sugerida: low | medium | high | critical
Evidencia: archivo(s), línea(s) o enlace relacionado.
Descripción: explicación del problema.
Recomendación: qué hacer para resolverlo.
```

## Registro
