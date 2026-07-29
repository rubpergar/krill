---
description: Agrupar cambios en commits semánticos y hacer push
---

Crea commits semánticos a partir de todos los cambios disponibles.

No hagas un solo commit grande por defecto.
Agrupa los archivos por propósito.
Haz commit de cada grupo por separado.

Si el usuario proporciona contexto adicional mediante `$ARGUMENTS`, úsalo para refinar los mensajes de commit — pero no fuerces texto que no describa con precisión los cambios.

## Pasos

### 1. Inspeccionar el estado del repositorio

```bash
git status --short
git diff --cached
git diff
git ls-files --others --exclude-standard
```

Comprende todos los cambios disponibles antes de hacer commit.

### 2. Detectar clave de issue

```bash
git branch --show-current
```

Si la rama contiene una clave de issue (`PROJ-123`, `POW-456`, `#123`), úsala en cada commit relacionado. De lo contrario, haz commit sin ella. No inventes una.

### 3. Agrupar cambios semánticamente

Agrupa archivos y hunks por intención. Un commit = un propósito.

Grupos válidos: una corrección de errores, una funcionalidad, una refactorización, una actualización de tests, un cambio de documentación, una actualización de dependencias, un cambio de config/CI.

Si dos archivos cambiaron por la misma razón, haz commit juntos. Si un archivo contiene cambios no relacionados, divide los hunks con `git add -p` o staged los archivos explícitamente con `git add <file>`. No uses `git add -A` a ciegas cuando los cambios no estén relacionados.

### 4. Crear commits uno por uno

Para cada grupo semántico:
1. Staged solo los archivos o hunks de ese grupo.
2. Verifica el diff staged con `git diff --cached`.
3. Crea un Conventional Commit.
4. Haz commit.
5. Repite hasta que no queden cambios significativos.

Formato del commit:

```
git commit -m "type(scope): summary"
git commit -m "issue-key: type(scope): summary"
```

Usa el tipo más preciso: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

Usa un scope corto cuando sea útil (área de funcionalidad, paquete, ruta, módulo, servicio, config). Omite el scope solo si no aporta valor.

Reglas del mensaje:
- Máximo 72 caracteres, modo imperativo, mayúscula inicial, sin punto final.
- Describe el propósito, no el archivo modificado.
- No uses `changes`, `stuff`, `misc` ni `wip`.

### 5. Seguir haciendo commit hasta terminar

Después de cada commit, verifica los cambios restantes con `git status --short`. Detente solo cuando:
- todos los cambios intencionales estén commiteados
- los cambios no relacionados o inseguros se hayan dejado sin staged a propósito
- el usuario deba decidir qué hacer con cambios ambiguos

### 6. Push al remoto

Una vez que todos los commits están hechos y no queda nada staged para este trabajo, haz push a la rama activa:

```bash
git push
```

Si el push falla porque la rama no tiene upstream o el remoto lo rechaza, detente e informa el bloqueador exacto sin adivinar una solución.

## Reglas de división

Divide los commits cuando los cambios no estén relacionados:
- Cambio de UI + actualización de dependencia = dos commits
- Corrección de error + test para ese error = generalmente un commit
- Refactorización + cambio de comportamiento = dos commits
- Documentación de una funcionalidad + código de la funcionalidad = generalmente un commit
- Formateo de muchos archivos + cambio de lógica = dos commits
- Lockfile generado por actualización de dependencia = mismo commit

Si un cambio no puede explicarse con la misma frase, divídelo.

## Reglas de seguridad

Nunca hagas commit de: secretos, archivos `.env` con valores reales, claves de API, tokens, credenciales, logs de depuración, archivos del editor local, archivos temporales, artefactos de build a menos que se les haga seguimiento intencionalmente, experimentos no relacionados.

Antes de cada commit, verifica el diff staged con `git diff --cached`. Si contiene cambios no relacionados, deshaz el staged con `git restore --staged <file>` y divide.

## Verificación final

Al terminar, ejecuta `git status --short`. Luego informa en la menor cantidad de palabras posible:
- commits creados
- archivos dejados intencionalmente sin commit
- cualquier cosa omitida por seguridad

Hecho significa historial semántico limpio, no solo cero archivos pendientes.
