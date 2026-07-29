---
description: Sincroniza los cambios pendientes de main con main-esp y traduce el contenido necesario
agent: krill-translation-orchestrator
---

Sincroniza la rama de traducción `main-esp` con los cambios que todavía no están reflejados desde `main`.

## Objetivo

Detectar cambios exclusivos de `main`, aplicar su contenido de forma semántica sobre el estado actual de `main-esp` y traducir únicamente la prosa que corresponda. No hagas un `merge` ni un `cherry-pick` automático de `main`, porque podría sobrescribir traducciones existentes.

## Reglas de seguridad

- Comunícate con el usuario en español.
- Trabaja únicamente si la rama actual es `main-esp`. Si no lo es, detente y explica el problema.
- No hagas `git merge`, `git cherry-pick`, `git rebase`, `git reset`, `git checkout`, `git restore`, `git commit` ni `git push`.
- No borres ni sobrescribas cambios locales no relacionados. Si hay cambios sin commit en archivos afectados, detente y pide instrucciones.
- No modifiques credenciales, archivos `.env`, licencias, `skills-lock.json`, SQL ni skills externas salvo que el análisis demuestre que un cambio estructural es imprescindible. En ese caso, detente y consulta.
- Preserva siempre rutas, nombres de archivos, comandos, identificadores, placeholders, estados, código, JSON, YAML, SQL, sintaxis Mermaid, URLs, nombres de tecnologías y contratos técnicos.
- No traduzcas commits ni mensajes de Git. Usa los commits solo como fuente de los cambios que deben incorporarse.
- No crees commits al terminar. Deja los cambios preparados para revisión del usuario.

## Flujo

### 1. Comprobar el estado

Ejecuta solo comandos Git de lectura para:

1. Confirmar la rama actual con `git branch --show-current`.
2. Confirmar que existen las referencias locales `main` y `main-esp`.
3. Revisar `git status --short`.
4. Obtener el ancestro común con `git merge-base main-esp main`.

Si `main` no existe localmente, no hagas `fetch` automáticamente. Informa de que primero hay que actualizar la referencia local de forma explícita.

### 2. Detectar cambios pendientes

Usa el ancestro común y el historial, no solo `git diff main-esp..main`, porque la rama `main-esp` contiene traducciones que deben conservarse.

Inspecciona:

- Commits exclusivos de `main` desde el ancestro común, en orden cronológico.
- Estadísticas y archivos afectados por cada commit mediante `git show`.
- Cambios netos de archivos entre el ancestro común y `main`.
- Renombrados, archivos nuevos y archivos eliminados.

Si no hay commits exclusivos ni cambios pendientes de `main`, informa de que `main-esp` ya está sincronizada y termina sin editar.

### 3. Clasificar los cambios

Para cada archivo afectado por cambios de `main`:

- `Traducible`: archivos propios de prosa, documentación, comandos, agentes y plantillas traducibles.
- `Técnico protegido`: SQL, licencias, `skills-lock.json`, skills externas, código, configuraciones, rutas, identificadores y valores de máquina.
- `Revisión manual`: cambios ambiguos, renombrados, eliminaciones, conflictos de estructura o cambios que afecten a una traducción existente.

Consulta la política de idioma y archivos protegidos en `AGENTS.md` y en la configuración de los agentes antes de editar.

### 4. Incorporar cambios sin sobrescribir traducciones

Para cada archivo traducible:

1. Lee la versión actual de `main-esp`.
2. Lee el parche o contenido correspondiente de `main` desde el ancestro común.
3. Identifica el cambio funcional o documental introducido en `main`.
4. Integra ese cambio en la versión española actual.
5. Traduce solo la prosa nueva o modificada.
6. Mantén la terminología y el estilo español ya existentes.

Para archivos nuevos, crea la versión española si el archivo pertenece al alcance traducible. Para archivos eliminados o renombrados, no actúes automáticamente: informa del caso y solicita confirmación.

Delega grupos de archivos independientes a `krill-translation-worker` sin solapar archivos. El orquestador debe revisar cada resultado antes de aceptarlo.

### 5. Verificar

Después de editar:

- Revisa `git diff` y confirma que solo contiene cambios derivados de `main` y sus traducciones.
- Comprueba que no se han traducido rutas, comandos, identificadores, estados, código ni valores técnicos.
- Comprueba que no se han modificado archivos protegidos.
- Comprueba que ningún cambio local previo del usuario haya sido sobrescrito.
- Ejecuta validaciones estructurales disponibles para Markdown, JSON y configuración de OpenCode.

## Informe final

Devuelve:

```md
## Estado de sincronización
- Rama actual:
- Rama fuente:
- Ancestro común:
- Estado: cambios aplicados / ya sincronizada / bloqueada

## Commits de main analizados
| Commit | Fecha | Resumen | Archivos relevantes |
|---|---|---|---|

## Cambios aplicados
| Archivo | Cambio de main | Traducción realizada |
|---|---|---|

## Revisión manual necesaria
- ...

## Validación
- Estado del árbol:
- Archivos protegidos comprobados:
- Validaciones ejecutadas:
```

Si no hay cambios pendientes, informa de ello brevemente y no generes modificaciones.
