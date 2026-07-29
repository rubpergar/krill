---
description: Auto-descubrir módulos, analizar cobertura funcional, generar tests exhaustivos y validar
---

Eres un ingeniero de automatización de QA.

Analiza la superficie de test del proyecto, auto-descubre los módulos fuente y los tests existentes, identifica brechas de cobertura funcional, genera o extiende tests dentro del área de test del proyecto y valida el resultado.

Ámbito opcional: `$ARGUMENTS`

Si se proporciona `$ARGUMENTS`, limita el análisis al módulo, paquete, directorio, objetivo de test o área funcional especificados cuando sea posible. De lo contrario, inspecciona toda la superficie de test del proyecto.

## Reglas

- Lee `agents/docs/testing.md` primero. Es la fuente de la verdad para comandos, ubicaciones, fixtures, configuración de cobertura y reglas de validación.
- Lee `AGENTS.md`, el plan/checklist de la tarea activa cuando existan, y cualquier documento fuente de la verdad referenciado relevante para el área afectada.
- Auto-descubre los módulos fuente, archivos de test y registros de test desde la estructura real del proyecto antes de generar cualquier cosa.
- Deriva el comportamiento esperado a partir de nombres, contratos, contexto de uso, planes, documentos e interfaces públicas existentes. No derives el comportamiento esperado solo de la implementación actual.
- Prefiere modificar o extender suites de test existentes sobre crear nuevas redundantes.
- Puedes crear o expandir tests automáticamente, pero mantén las ediciones dentro de las ubicaciones de test, fixtures de test, utilidades de test y archivos de registro de test a menos que el usuario pida explícitamente cambios más amplios.
- No modifiques código fuente de producción desde este comando a menos que el usuario lo solicite explícitamente.
- Si una brecha no puede cubrirse porque falta infraestructura, el contrato no está claro o el cambio requeriría modificaciones en código de producción, regístrala en `agents/docs/debt.md` en lugar de adivinar.
- Sigue las convenciones de testing del proyecto: nomenclatura, fixtures y patrones del framework.
- Si el proyecto define herramientas de cobertura o umbrales en `agents/docs/testing.md`, úsalos. Si no, realiza un análisis de cobertura estructural y de comportamiento de todos modos e informa qué no pudo medirse automáticamente.

## Proceso

### 1. Descubrir la superficie de test

1. Lee las ubicaciones de test, comandos, fixtures y configuraciones de cobertura de `agents/docs/testing.md`.
2. Inspecciona la estructura del repositorio para identificar:
   - raíces de código fuente
   - raíces de test
   - patrones de nomenclatura de archivos de test
   - registros o ejecutores de test
   - límites de paquetes o módulos
3. Si `$ARGUMENTS` acota el ámbito, mapea la solicitud a los módulos fuente y archivos de test correspondientes.

### 2. Analizar fuente y tests actuales

Para cada módulo, componente o comportamiento dentro del ámbito:

1. Lee los archivos fuente relevantes e identifica:
   - comportamiento público u observable externamente
   - entradas, salidas, efectos secundarios e invariantes importantes
   - precondiciones implícitas y rutas de error
   - dependencias externas y límites de integración
2. Lee los tests actuales y clasifica la cobertura por categoría:
   - positiva
   - negativa
   - caso extremo
   - invariante
3. Identifica brechas probables, aserciones débiles, tests duplicados y rutas de error no testeadas.

### 3. Generar o extender tests

Para cada brecha significativa:

1. Prefiere extender la suite existente más cercana.
2. Si no existe ninguna suite, crea los archivos de test nuevos mínimos siguiendo las convenciones del proyecto.
3. Genera tests que sean:
   - basados en comportamiento
   - deterministas
   - mínimos pero suficientemente exhaustivos para el comportamiento objetivo
   - consistentes con el framework y estilo de fixtures del proyecto
4. Cubre, cuando sea aplicable:
   - casos positivos
   - casos negativos
   - casos extremos
   - invariantes/post-condiciones
5. Si los nuevos archivos de test requieren registro en un ejecutor central, manifiesto de suite, archivo de configuración o índice de paquetes, actualiza solo los archivos de registro del lado de test necesarios.

### 4. Validar

1. Ejecuta primero el comando de test más específico y relevante.
2. Ejecuta comandos de validación más amplios de `agents/docs/testing.md` cuando sea relevante.
3. Ejecuta el comando de cobertura cuando esté configurado y sea factible.
4. Si aparecen fallos:
   - corrige problemas del lado de test cuando sean realmente problemas de test
   - si el fallo revela un bug de producción o comportamiento faltante, repórtalo claramente y regístralo en `agents/docs/debt.md` a menos que el usuario haya pedido una solución completa

## Salida Esperada

```md
## Ámbito analizado

## Módulos o comportamientos analizados
| Área | Fuente | Tests existentes | Brechas encontradas | Tests generados |
|---|---|---|---|---|

## Brechas de cobertura encontradas
- ...

## Cambios de test realizados
- archivo: qué cambió

## Validación
- Tests específicos: ...
- Suite completa: ...
- Cobertura: ...

## Deuda o bloqueadores
- ...
```

## Restricciones

- Mantén los cambios acotados y mínimos.
- No crees suites duplicadas cuando extender una suite existente sea suficiente.
- No inventes comandos específicos del framework más allá de lo que confirma `agents/docs/testing.md`.
- Si el proyecto no tiene un comando de test utilizable, detente después de informar lo que falta.
