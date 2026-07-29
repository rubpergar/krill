# Procedencia de Skills

Este directorio contiene skills de agente opcionales utilizadas por el esqueleto. Las skills se cargan solo cuando su activador coincide con la tarea.

El archivo canónico de bloqueo de skills es `skills-lock.json` en la raíz del repositorio. Es el registro técnico de instalación: almacena la fuente upstream, la ruta de origen y el hash calculado para cada skill activa. Consérvalo a menos que se reemplace el mecanismo de instalación de skills, porque este README es un resumen de licencia/procedencia orientado a humanos, no un archivo de bloqueo.

## Política de Licencias
- Mantén los archivos de licencia y atribución originales de cada skill junto con la skill.
- Antes de modificar una skill, revisa su front matter, los archivos locales `LICENSE`/`NOTICE`, este README y el `skills-lock.json` raíz.
- Las adaptaciones internas de la empresa están permitidas cuando la licencia upstream permita la modificación, pero conserva la atribución y marca los cambios sustanciales.
- No redistribuyas, publiques, vendas ni entregues este esqueleto externamente hasta que se hayan revisado todas las licencias y avisos de las skills incluidas.
- Si una skill no tiene un archivo de licencia local pero se conoce la licencia de su repositorio upstream, conserva la referencia upstream aquí y considera copiar el archivo de licencia al directorio de la skill.
- Este archivo no es asesoría legal; es una lista de verificación de trabajo para que el agente no asuma permisos que no están presentes o registrados.

## Notas de Modificación
Para ediciones sustanciales a una skill de terceros, añade una nota breve cerca del inicio de la skill modificada:

```md
## Internal Modifications
Modified by: <company/project>
Date: YYYY-MM-DD
Purpose: Adapted for internal development workflow.
Distribution: Internal use only unless licenses are reviewed before redistribution.
Original source/license: <source and license>
```

## Referencias de Skills

### `code-review-excellence`
- Ruta local: `agents/skills/code-review-excellence/`
- Fuente de bloqueo: `wshobson/agents`
- Ruta de fuente de bloqueo: `plugins/developer-essentials/skills/code-review-excellence/SKILL.md`
- Señal de licencia local: no se encontró licencia local/front matter.
- Licencia upstream verificada: Licencia MIT en `https://github.com/wshobson/agents/blob/main/LICENSE`.
- Estado práctico: se permiten modificación y uso comercial interno bajo MIT; añade referencia de atribución/licencia local antes de la redistribución externa.

### `context7-mcp`
- Ruta local: `agents/skills/context7-mcp/`
- Fuente de bloqueo: `upstash/context7` (GitHub; consulta `skills-lock.json`).
- Ruta de fuente de bloqueo (copia local): `<user-home-dir>/.agents/skills/context7-mcp/SKILL.md` (resuelta durante la instalación).
- Señal de licencia local: no se encontró licencia local/front matter.
- Licencia upstream verificada: no disponible desde los metadatos actuales del repositorio.
- Estado práctico: tratar como solo interno hasta que se registre la procedencia. Esta skill requiere la herramienta Context7 MCP configurada en el runtime del agente; no almacenes claves API ni credenciales en este repositorio.

### `find-skills`
- Ruta local: `agents/skills/find-skills/`
- Fuente de bloqueo: `vercel-labs/skills` (GitHub; consulta `skills-lock.json`).
- Ruta de fuente de bloqueo (copia local): `<user-home-dir>/.agents/skills/find-skills/SKILL.md` (resuelta durante la instalación).
- Señal de licencia local: no se encontró licencia local/front matter.
- Licencia upstream verificada: no disponible desde los metadatos actuales del repositorio.
- Estado práctico: tratar como solo interno hasta que se registre la procedencia.

### `interface-design`
- Ruta local: `agents/skills/interface-design/`
- Fuente de bloqueo: consolidación interna.
- Ruta de fuente de bloqueo: `agents/skills/interface-design/SKILL.md`
- Origen: consolida y reemplaza las antiguas skills `ui-ux-pro-max`, `frontend-design`, `web-design-guidelines` y `accessibility` para evitar solapamiento de UI y reducir el uso de tokens/recursos.
- Procedencia del material fuente: `ui-ux-pro-max` de `nextlevelbuilder/ui-ux-pro-max-skill` (MIT), `frontend-design` de `anthropics/skills` (había un archivo de licencia local Apache-2.0 antes de la consolidación), `web-design-guidelines` de `vercel-labs/agent-skills` / `vercel-labs/web-interface-guidelines` (MIT), y `accessibility` de `addyosmani/web-quality-skills` (MIT).
- Estado práctico: guía interna del esqueleto adaptada de skills previamente instaladas; revisa las obligaciones de licencia originales antes de la redistribución externa.

### `performance`
- Ruta local: `agents/skills/performance/`
- Fuente de bloqueo: `addyosmani/web-quality-skills`
- Ruta de fuente de bloqueo: `skills/performance/SKILL.md`
- Señal de licencia local: `license: MIT` en front matter de `SKILL.md`.
- Licencia upstream verificada: Licencia MIT en `https://github.com/addyosmani/web-quality-skills/blob/main/LICENSE`.
- Estado práctico: se permiten modificación y uso comercial interno bajo MIT; conserva los avisos de copyright/licencia al redistribuir porciones sustanciales.

### `security-review`
- Ruta local: `agents/skills/security-review/`
- Fuente de bloqueo: `getsentry/skills`
- Ruta de fuente de bloqueo: `skills/security-review/SKILL.md`
- Señal de licencia local: `license: LICENSE` en front matter de `SKILL.md`.
- Archivo de licencia local: `agents/skills/security-review/LICENSE`, documentando material de OWASP Cheat Sheet Series bajo CC BY-SA 4.0.
- Licencia upstream verificada: el repositorio `getsentry/skills` reporta Licencia Apache 2.0; esta skill local también incluye material de referencia derivado de OWASP bajo CC BY-SA 4.0.
- Estado práctico: se permiten modificación y uso comercial interno, pero conserva la atribución. Si redistribuyes material adaptado derivado de OWASP, sigue las obligaciones de atribución y ShareAlike de CC BY-SA 4.0; para material de origen de Sentry, sigue los avisos de Apache-2.0.

### `seo-audit`
- Ruta local: `agents/skills/seo-audit/`
- Fuente de bloqueo: `coreyhaines31/marketingskills`
- Ruta de fuente de bloqueo: `skills/seo-audit/SKILL.md`
- Señal de licencia local: no se encontró licencia local/front matter.
- Licencia upstream verificada: Licencia MIT en `https://github.com/coreyhaines31/marketingskills/blob/main/LICENSE`.
- Estado práctico: se permiten modificación y uso comercial interno bajo MIT; añade referencia de atribución/licencia local antes de la redistribución externa.

### `test-driven-development`
- Ruta local: `agents/skills/test-driven-development/`
- Fuente de bloqueo: `obra/superpowers`
- Ruta de fuente de bloqueo: `skills/test-driven-development/SKILL.md`
- Señal de licencia local: no se encontró licencia local/front matter.
- Licencia upstream verificada: Licencia MIT en `https://github.com/obra/superpowers/blob/main/LICENSE`.
- Estado práctico: se permiten modificación y uso comercial interno bajo MIT; añade referencia de atribución/licencia local antes de la redistribución externa.

## Referencias de Skills Retiradas

Las antiguas skills `accessibility`, `frontend-design`, `ui-ux-pro-max` y `web-design-guidelines` fueron retiradas en favor de `interface-design`. Su procedencia se conserva en la entrada de `interface-design` más arriba.
