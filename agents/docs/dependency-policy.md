# Política de Dependencias

Reglas para introducir nuevas dependencias (librerías, paquetes, frameworks) en el proyecto. El objetivo es evitar la hinchazón accidental de dependencias y asegurar que cada adición esté justificada, evaluada y registrada.

## Alcance

Aplica a todas las dependencias de runtime. Las dependencias de desarrollo para herramientas (lint, formato, pruebas, verificación de tipos) siguen un camino más ligero descrito en la sección de excepciones.

Las dependencias que forman parte del andamio inicial del proyecto (elegidas durante el bootstrap) están exentas — ya están decididas por la selección del stack.

## 1. Justificación

Antes de agregar cualquier dependencia, responde:

- ¿Qué problema específico resuelve?
- ¿Puede resolverse con la librería estándar del lenguaje/runtime o con código existente del proyecto?
- Si ya existe una dependencia similar en el proyecto, ¿por qué no es suficiente?

## 2. Alternativas Consideradas

Evalúa al menos dos alternativas (incluyendo "no agregar nada"). Para cada una:

| Alternativa | Madurez | Licencia | Mantenimiento | Seguridad | Tamaño |
|---|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

## 3. Criterios de Evaluación

### Madurez
- Versión estable (no alpha/beta/0.x a menos que esté justificado)
- Lanzamientos regulares y mantenimiento activo
- Número de mantenedores y tamaño de la comunidad

### Licencia
Debe ser compatible con la licencia del proyecto. Verifica:
- Identificador SPDX
- Riesgo de copyleft de la familia GPL
- Concesiones de patentes si aplica

### Costo de Mantenimiento
- Frecuencia de cambios disruptivos
- Número de dependencias transitivas
- Capacidad de respuesta de la comunidad (issues, PRs)

### Seguridad
- CVEs históricos y cómo se manejaron
- Superficie de ataque de la dependencia
- Riesgo de cadena de suministro (confiabilidad del mantenedor, control de acceso)

### Impacto de Tamaño
- Contribución al tamaño del bundle (si es navegador/lado cliente)
- Profundidad y anchura del árbol de dependencias transitivas
- Tiempo de instalación e impacto en disco

## 4. Política de Versiones — Solo Versiones Exactas

### Regla
Todas las dependencias en `package.json` DEBEN usar versiones exactas (`"1.2.3"`). Los rangos con caret (`"^1.2.3"`), tilde (`"~1.2.3"`) u otros operadores NO están permitidos a menos que se aprueben explícitamente mediante una excepción vía ADR.

### Justificación
- `^1.2.3` permite la resolución automática de `1.2.4`, `1.3.0`, etc. Incluso los lanzamientos menores o de parche pueden introducir cambios de comportamiento, regresiones o incompatibilidades.
- El fijado exacto da control explícito sobre cuándo ocurren las actualizaciones.
- El archivo de bloqueo (`package-lock.json` / `yarn.lock` / `pnpm-lock.yaml`) ya fija las resoluciones transitivas, pero fijar en `package.json` añade una capa visible y auditable de intención.

### Cómo Funcionan las Actualizaciones
- Las actualizaciones mayores, menores y de parche se gestionan mediante herramientas automatizadas (Dependabot, Renovate) o PRs manuales explícitos.
- Cada PR de actualización debe revisarse en busca de cambios disruptivos, diferencias en el changelog y compatibilidad antes de fusionarse.
- Los parches de seguridad siguen el mismo proceso pero con mayor prioridad — no están exentos de revisión.

## 5. Registro de Decisión

Cada nueva dependencia (incluyendo la versión elegida) DEBE registrarse como un ADR en `agents/docs/decisions.md` con:

- Nombre y versión exacta
- Propósito y alcance de uso
- Alternativas consideradas y por qué fueron rechazadas
- Resumen de evaluación (licencia, madurez, mantenimiento, seguridad, tamaño)

## 6. Excepciones

Las siguientes dependencias de desarrollo pueden saltarse el paso de evaluación de alternativas, pero aún necesitan justificación y una entrada de ADR:

- Linter y formateador (ESLint, Prettier, Ruff, rustfmt, etc.) — cuando son el estándar del ecosistema
- Framework de pruebas (Vitest, Jest, pytest, etc.) — cuando es coherente con el stack del proyecto
- Verificador de tipos (TypeScript, mypy, etc.)
- Herramientas de compilación (Vite, esbuild, Webpack, etc.) — cuando son coherentes con el stack del proyecto

Todas las demás dependencias de desarrollo (plugins, ejecutores personalizados, generadores de código) siguen la política completa.

## 7. Exclusión de Límites

La regla de Límites del flujo de trabajo SDD (`AGENTS.md`) ya dice:

> "Do not introduce dependencies without documenting why."

Esta política es el mecanismo de "documentar por qué". Esa regla está actualizada para referenciar esto.

## 8. Proceso de Excepción

Para aprobar una excepción a cualquier regla de esta política:
- Documenta la excepción en el plan de la tarea con su justificación.
- Obtén aprobación explícita del usuario.
- Registra la excepción como un ADR.

## Exento de Esta Política

- Dependencias introducidas durante el bootstrap o inicialización del andamio del proyecto.
- Parches de seguridad críticos (CVE con explotación activa) — pero la actualización aún necesita una entrada de ADR dentro de un ciclo de trabajo.
