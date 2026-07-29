# Bootstrap

Fuente de verdad para el modo `skeleton`. Define cómo preparar el esqueleto del agente para un proyecto real antes de cambiar al modo `project`.

## Propósito

Configurar el agente con suficiente contexto verificado para trabajar sin incertidumbre evitable. Bootstrap no es implementación de producto.

## Alcance Permitido

Limitado a archivos de agente y flujo de trabajo (`AGENTS.md`, `agents/**`, `.opencode/**`) a menos que el usuario expanda explícitamente el alcance.

## Reglas de Aprobación

- **Modo skeleton**: editar archivos de configuración del agente no requiere aprobación del usuario. El agente puede escribir libremente en `AGENTS.md`, `agents/**` y `.opencode/**` durante el bootstrap.
- **Modo project**: el mapa de fuentes de verdad en `AGENTS.md` determina qué documentos necesitan aprobación explícita antes de modificarse.

## Dos Caminos

El repositorio puede prepararse para un proyecto real de dos maneras:

### Camino A: Descubrimiento de Proyecto Existente

Un proyecto con código fuente existente (manifiestos de paquetes, `src/`, archivos de configuración, etc.).

Usa el comando `/bootstrap` (`.opencode/commands/bootstrap.md`), que:
1. Inspecciona la estructura y el stack del repositorio
2. Entrevista al usuario para confirmar hallazgos y llenar vacíos
3. Detecta archivos existentes de esquema DB y registro de cambios DB, y actualiza las rutas del mapa de fuentes de verdad en `AGENTS.md` cuando corresponda
4. Detecta la configuración de ejecución del agente a nivel de proyecto, como plugins de `opencode.json` y MCPs cuando estén presentes
5. Escribe documentos de fuente de verdad solo con hechos confirmados
6. Ejecuta una verificación de preparación
7. Ofrece la transición al modo project si está listo

**Criterios de preparación:**
- Identidad del producto (nombre, dominio, usuarios, objetivo) confirmada por el usuario
- Runtime/framework confirmado
- Gestor de paquetes confirmado
- Comando de instalación confirmado
- Al menos un comando de prueba confirmado
- Lint/typecheck/build pueden diferirse

**Detección de archivos DB:**
- Si el proyecto ya contiene esquema DB o archivos de registro de cambios SQL ordenados, `/bootstrap` debería proponerlos como las rutas `DB schema` y `DB change log` en el mapa de fuentes de verdad.
- Si el proyecto no los contiene, mantener `agents/db/schema.sql` y `agents/db/changes.sql` como rutas predeterminadas.
- Después del bootstrap, el trabajo de implementación normal debe usar las rutas DB declaradas en el mapa de fuentes de verdad sin ningún documento de políticas DB adicional.

**Transición:** Cuando se supere la preparación (100 % de campos críticos o >= 75 % con consentimiento del usuario), el comando actualiza el modo en `AGENTS.md`, archiva este archivo independientemente de su completitud, y confirma el cambio. Los campos pendientes se registran en el mensaje del modo project en `AGENTS.md`.

### Camino B: Inicialización de Proyecto Nuevo

Un proyecto desde cero sin código de producto aún.

No hay un único comando `/bootstrap`. El agente inicializa el andamiaje técnico y completa la configuración de forma incremental a medida que el proyecto crece. Esto requiere aprobación explícita del usuario y un breve plan de inicialización.

**Criterios de preparación (más ligeros):**
- Stack (runtime, framework, gestor de paquetes) elegido e inicializado
- El comando de instalación funciona
- Al menos un comando de prueba configurado (incluso un placeholder)
- Los comandos de lint y dev pueden diferirse

**Transición:** Cuando se cumplan estos mínimos, el agente puede proponer la transición al modo project. El usuario decide.

## Transición al Modo Project

Tras la aprobación del usuario, realizar en un solo paso de mantenimiento delimitado:

1. En `AGENTS.md`:
   - Cambiar `Current mode: skeleton` a `Current mode: project`
   - Reemplazar el mensaje de encabezado del modo skeleton con:
     ```
     Current mode: `project`.
     
     This repository is an active project. Use the SDD/TDD workflow and the source-of-truth documents under `agents/**`.
     
     Bootstrap is complete. Archived bootstrap documents are historical references only and must not be followed unless the user explicitly requests bootstrap maintenance or review.
     ```
2. Mover este archivo de `agents/docs/bootstrap.md` a `agents/task/archive/bootstrap-YYYY-MM-DD.md`
3. Confirmar que el documento archivado es solo referencia histórica

## Documentos de Bootstrap Archivados

Los documentos de bootstrap archivados son solo referencia histórica. No deben seguirse durante el trabajo del proyecto a menos que el usuario solicite explícitamente revisar el historial de bootstrap o realizar mantenimiento de bootstrap.
