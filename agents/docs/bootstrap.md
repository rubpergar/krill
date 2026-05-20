# Bootstrap

Fuente de verdad para el modo `skeleton`. Define cómo preparar el esqueleto del agente para un proyecto real antes de cambiar al modo `project`.

## Propósito

Configurar el agente con suficiente contexto verificado para trabajar sin incertidumbre evitable. Bootstrap no es implementación de producto.

## Alcance Permitido

Limitado a archivos de agente y flujo de trabajo (`AGENTS.md`, `agents/**`, `.opencode/**`) a menos que el usuario expanda el alcance explícitamente.

## Reglas de Aprobación

- **Modo skeleton**: editar archivos de configuración del agente no requiere aprobación del usuario. El agente puede escribir libremente en `AGENTS.md`, `agents/**` y `.opencode/**` durante el bootstrap.
- **Modo project**: el Mapa de Fuentes de Verdad en `AGENTS.md` determina qué documentos necesitan aprobación explícita antes de modificarse.

## Dos Caminos

El repositorio puede prepararse para un proyecto real de dos maneras:

### Camino A: Descubrimiento de Proyecto Existente

Un proyecto con código fuente existente (manifiestos de paquetes, `src/`, archivos de configuración, etc.).

Usa el comando `/bootstrap` (`.opencode/commands/bootstrap.md`), que:
1. Inspecciona la estructura y el stack del repositorio
2. Entrevista al usuario para confirmar hallazgos y llenar vacíos
3. Detecta esquemas de BD y archivos de registro de cambios de BD existentes y actualiza las rutas del Mapa de Fuentes de Verdad en `AGENTS.md` cuando sea apropiado
4. Escribe documentos fuente de verdad solo con hechos confirmados
5. Ejecuta una verificación de preparación
6. Ofrece la transición al modo project si está listo

**Criterios de preparación:**
- Identidad del producto (nombre, dominio, usuarios, objetivo) confirmada por el usuario
- Runtime/framework confirmado
- Gestor de paquetes confirmado
- Comando de instalación confirmado
- Al menos un comando de prueba confirmado
- Lint/verificador de tipos/compilación pueden diferirse

**Detección de archivos de BD:**
- Si el proyecto ya contiene esquemas de BD o archivos de registro de cambios SQL ordenados, `/bootstrap` debe proponer esos archivos como las rutas de `DB schema` y `DB change log` en el Mapa de Fuentes de Verdad.
- Si el proyecto no los contiene, mantén `agents/db/schema.sql` y `agents/db/changes.sql` como las rutas predeterminadas.
- Después del bootstrap, el trabajo de implementación normal debe usar las rutas de BD declaradas en el Mapa de Fuentes de Verdad sin ningún documento de política de BD adicional.

**Transición:** Cuando la preparación se cumple (100% de campos críticos o >= 75% con consentimiento del usuario), el comando actualiza el modo en `AGENTS.md`, archiva este documento independientemente de su integridad, y confirma el cambio. Los campos pendientes se registran en el mensaje de modo project en `AGENTS.md`.

### Camino B: Inicialización de Proyecto Nuevo

Un proyecto desde cero sin código de producto aún.

No hay un solo comando `/bootstrap`. El agente inicializa el andamio técnico y llena la configuración incrementalmente a medida que el proyecto crece. Esto requiere aprobación explícita del usuario y un breve plan de inicialización.

**Criterios de preparación (más ligeros):**
- Stack (runtime, framework, gestor de paquetes) elegido e inicializado
- El comando de instalación funciona
- Al menos un comando de prueba configurado (incluso provisional)
- Lint y comandos de desarrollo pueden diferirse

**Transición:** Cuando estos mínimos se cumplen, el agente puede proponer la transición al modo project. El usuario decide.

## Transición al Modo Project

Después de la aprobación del usuario, realiza en un solo paso de mantenimiento delimitado:

1. En `AGENTS.md`:
   - Cambia `Current mode: skeleton` a `Current mode: project`
   - Reemplaza el mensaje de encabezado del modo skeleton con:
     ```
     Current mode: `project`.

     This repository is an active project. Use the SDD/TDD workflow and the source-of-truth documents under `agents/**`.

     Bootstrap is complete. Archived bootstrap documents are historical references only and must not be followed unless the user explicitly requests bootstrap maintenance or review.
     ```
2. Mueve este archivo de `agents/docs/bootstrap.md` a `agents/task/archive/bootstrap-YYYY-MM-DD.md`
3. Confirma que el documento archivado es solo referencia histórica

## Documentos de Bootstrap Archivados

Los documentos de bootstrap archivados son solo referencias históricas. No los sigas durante el trabajo del proyecto a menos que el usuario solicite explícitamente revisar el historial de bootstrap o realizar mantenimiento de bootstrap.
