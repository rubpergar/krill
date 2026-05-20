# Deuda Técnica

Registro de errores, problemas, mejoras o incidentes que el agente encuentra mientras trabaja en una tarea y que están fuera del alcance de la tarea actual.

Cuando el agente encuentra algo relevante pero fuera de alcance, debe registrarlo aquí en lugar de modificarlo sin permiso. El usuario revisa periódicamente el registro y decide si crear una tarea formal.

## Estados
- `open`: pendiente de revisión del usuario.
- `dismissed`: el usuario decidió no abordarlo.

## Formato

```md
## DBT-XXX: Título corto
Fecha: YYYY-MM-DD
Estado: open | dismissed
Riesgo: low | medium | high
Impacto: low | medium | high
Prioridad sugerida: low | medium | high | critical
Evidencia: Archivo(s), línea(s) o enlace relacionado.
Descripción: Explicación del problema.
Recomendación: Qué hacer para resolverlo.
```

## Registro
