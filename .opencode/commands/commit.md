---
description: Group changes into semantic commits and push
---

Crea commits semánticos a partir de todos los cambios disponibles.

No hagas un solo commit grande por defecto.
Agrupa los archivos por propósito.
Haz commit de cada grupo por separado.

Si el usuario proporciona contexto adicional mediante `$ARGUMENTS`, úsalo para refinar los mensajes de commit — pero no fuerces texto que no describa con precisión los cambios.

## Steps

### 1. Inspect repository state

```bash
git status --short
git diff --cached
git diff
git ls-files --others --exclude-standard
```

Entiende cada cambio disponible antes de hacer commit.

### 2. Detect issue key

```bash
git branch --show-current
```

Si la rama contiene una clave de issue (`PROJ-123`, `POW-456`, `#123`), úsala en cada commit relacionado. De lo contrario, haz commit sin ella. No inventes una.

### 3. Group changes semantically

Agrupa archivos y hunks por intención. Un commit = un propósito.

Grupos válidos: una corrección de bug, una funcionalidad, una refactorización, una actualización de pruebas, un cambio de documentación, una actualización de dependencias, un cambio de configuración/CI.

Si dos archivos cambiaron por la misma razón, haz commit juntos. Si un archivo contiene cambios no relacionados, divide los hunks con `git add -p` o agrega archivos explícitamente con `git add <file>`. No uses `git add -A` a ciegas cuando los cambios no están relacionados.

### 4. Create commits one by one

Para cada grupo semántico:
1. Agrega solo los archivos o hunks de ese grupo.
2. Verifica el diff agregado con `git diff --cached`.
3. Crea un Conventional Commit.
4. Haz commit.
5. Repite hasta que no queden cambios significativos.

Formato de commit:

```
git commit -m "type(scope): summary"
git commit -m "issue-key: type(scope): summary"
```

Usa el tipo más preciso: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Usa un scope corto cuando sea útil (área de funcionalidad, paquete, ruta, módulo, servicio, config). Omite el scope solo si no aporta valor.

Reglas del mensaje:
- Máximo 72 caracteres, modo imperativo, mayúscula inicial, sin punto.
- Describe el propósito, no el archivo modificado.
- No uses `changes`, `stuff`, `misc` o `wip`.

### 5. Keep committing until done

Después de cada commit, verifica los cambios restantes con `git status --short`. Detente solo cuando:
- todos los cambios intencionales están commiteados
- los cambios no relacionados o inseguros quedan sin agregar a propósito
- el usuario debe decidir qué hacer con cambios ambiguos

## Splitting rules

Divide los commits cuando los cambios no estén relacionados:
- cambio de UI + actualización de dependencias = dos commits
- corrección de bug + prueba para ese bug = generalmente un commit
- refactorización + cambio de comportamiento = dos commits
- documentación de una funcionalidad + código de la funcionalidad = generalmente un commit
- formateo de muchos archivos + cambio de lógica = dos commits
- lockfile generado por actualización de dependencias = mismo commit

Si un cambio no puede explicarse con la misma oración, divídelo.

## Safety rules

Nunca hagas commit de: secretos, archivos `.env` con valores reales, claves de API, tokens, credenciales, registros de depuración, archivos locales del editor, archivos temporales, artefactos de compilación a menos que se rastreen intencionalmente, experimentos no relacionados.

Antes de cada commit, verifica el diff agregado con `git diff --cached`. Si contiene cambios no relacionados, desagrega con `git restore --staged <file>` y divide.

## Final check

Cuando termines, ejecuta `git status --short`. Luego informa en la menor cantidad de palabras posible:
- commits creados
- archivos intencionalmente dejados sin commit
- cualquier cosa omitida por seguridad

Hecho significa historial semántico limpio, no solo cero archivos pendientes.
