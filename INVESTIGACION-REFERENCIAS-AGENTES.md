# Investigación comparativa de agentes y skills

Fecha de consulta: 2026-08-28

## Objetivo y alcance

Esta es una investigación ligera para comparar cómo varios proyectos organizan
comandos, skills, agentes, artefactos y validación alrededor del desarrollo con
agentes. El objetivo no es copiar una metodología completa, sino identificar
ideas que puedan mejorar Krill sin aumentar su complejidad innecesariamente.

Las fuentes se consultaron en sus ramas principales en la fecha indicada. Los
enlaces apuntan al contenido original y pueden evolucionar después de esta
consulta. Las propuestas de este documento no están aplicadas en Krill; quedan
pendientes de validación.

## Resumen ejecutivo

- **Matt Pocock / `skills`** prioriza skills pequeñas, composables y fáciles de
  adaptar. Distingue entre skills invocadas por el usuario y skills que el
  modelo puede activar cuando detecta el contexto adecuado. Incluye piezas
  concretas para grilling, investigación, especificación, TDD, revisión y
  arquitectura.
- **GitHub Spec Kit** organiza el desarrollo alrededor de una cadena de
  artefactos: principios del proyecto, especificación, plan, tareas,
  implementación y convergencia. Su principal aportación para Krill es hacer
  explícita la trazabilidad entre intención, plan, tareas y validación.
- **Warp `skill-doctor`** no es una skill de implementación. Es una herramienta
  meta para evaluar skills a partir de conversaciones reales, calcular señales
  de eficiencia y calidad y proponer cambios concretos.
- **`bro-skill`** es deliberadamente mínimo: una única acción, un disparador
  claro y reglas estrictas. Sirve como recordatorio de que no toda capacidad
  necesita convertirse en un flujo grande.
- **Superpowers** combina skills con activación automática, worktrees,
  ejecución mediante subagentes, revisiones por tarea y una revisión final.
  Aporta una estrategia para escalar el contexto y obtener revisiones
  independientes, pero también introduce bastante ceremonia.

La conclusión práctica es mantener en Krill una separación sencilla:

```text
comando  = orquesta una acción iniciada por el usuario
skill    = conocimiento o disciplina reutilizable
agente   = contexto o rol especializado de ejecución/revisión
artefacto = estado persistente que permite inspeccionar y reanudar
```

Krill ya tiene comandos, skills, documentación fuente de verdad y archivos de
tarea. La mayor oportunidad no es añadir muchos componentes, sino definir
mejor las fronteras entre ellos y medir si las nuevas reglas mejoran resultados
reales.

## Comparación general

| Referencia | Unidad principal | Flujo | Uso de agentes | Validación destacada |
|---|---|---|---|---|
| Matt Pocock | Skills composables | Se combinan según el problema | Distingue skills invocadas por usuario y por modelo | TDD, revisión en dos ejes, investigación y diseño de módulos |
| GitHub Spec Kit | Artefactos de especificación y comandos | `constitution -> specify -> plan -> tasks -> implement -> converge` | Integraciones con distintos harnesses; los comandos son el centro | `analyze`, `checklist`, gates constitucionales y converge |
| Warp `skill-doctor` | Evaluación meta de skills | Recopilar conversaciones -> puntuar -> proponer cambios | No añade un agente de desarrollo | Métricas, evidencias de sesiones y diffs propuestos |
| `bro-skill` | Skill atómica | Una invocación, una transformación | No usa agentes | Claridad del disparador y cumplimiento de una tarea pequeña |
| Superpowers | Skills + plugin + subagentes | Diseño -> plan -> tareas -> ejecución -> revisiones -> cierre | Subagente nuevo por tarea y revisiones independientes | TDD, revisión de especificación y calidad, verificación antes de terminar |
| Krill | Comandos OpenCode + skills + docs + tareas | SDD/TDD con `todo`, `current` y `archive` | No define agentes personalizados | TDD, DoD, converge y revisión de tarea |

## 1. Matt Pocock: `mattpocock/skills`

### Qué hace

El repositorio se presenta como una colección de skills pequeñas,
composables y adaptables, en vez de un proceso monolítico. La instalación
puede gestionarse como plugin de Claude Code o copiar skills editables al
proyecto mediante `skills.sh`. También existe un paso de configuración que
pregunta por tracker de issues, labels y ubicación de documentos. [M1]

Su catálogo separa explícitamente:

- **User-invoked skills**, accesibles cuando el usuario las solicita y
  orientadas a orquestar acciones.
- **Model-invoked skills**, que el agente puede usar automáticamente cuando el
  problema encaja.

Entre las skills relevantes aparecen `grill-with-docs`, `research`, `to-spec`,
`implement`, `tdd`, `code-review`, `codebase-design`,
`improve-codebase-architecture` y `writing-skills`. [M1]

### Ideas concretas

1. **Separar orquestación y disciplina.** Un comando o skill iniciada por el
   usuario puede coordinar el trabajo, mientras que una skill invocable por el
   modelo contiene una técnica reutilizable.
2. **Hacer la investigación un artefacto.** Su skill `research` ordena usar
   fuentes primarias y guardar los hallazgos en un único Markdown citado. [M2]
3. **Revisar en dos ejes.** `code-review` separa cumplimiento de estándares y
   cumplimiento de la especificación. Ambos análisis se ejecutan en paralelo
   para evitar que una perspectiva oculte a la otra. [M3]
4. **Usar vocabulario compartido.** `grill-with-docs` combina preguntas de
   aclaración con la construcción de un lenguaje de dominio y decisiones
   documentadas. [M1]
5. **Medir el diseño, no solo los tests.** La skill de arquitectura busca
   oportunidades para crear módulos más profundos y se plantea como una
   revisión periódica, no como una reescritura automática. [M1]

### Qué no copiar sin más

- Un catálogo grande de skills puede hacer más difícil descubrir cuál aplicar.
- El modelo de invocación automática depende del harness y de sus reglas de
  descubrimiento; no se debe asumir que OpenCode lo interpreta igual.
- El repositorio usa integración con trackers y convenciones propias. Krill no
  necesita incorporar un tracker para aprovechar la separación entre skills.

## 2. GitHub Spec Kit

### Qué hace

Spec Kit instala una estructura de desarrollo orientada a especificaciones para
distintos agentes. Su recorrido principal es:

```text
/speckit.constitution
        -> /speckit.specify
        -> /speckit.plan
        -> /speckit.tasks
        -> /speckit.implement
        -> /speckit.converge
```

La constitución se crea una vez por proyecto. La especificación define qué y
por qué; el plan traduce esos requisitos a decisiones técnicas; `tasks` genera
trabajo ejecutable; `implement` ejecuta; y `converge` contrasta el resultado
contra especificación, plan y tareas. El ciclo de implementación y
convergencia puede repetirse hasta quedar alineado. [S1]

También ofrece comandos opcionales como `clarify`, `analyze` y `checklist`, y
extensiones para problemas como evaluación de ideas o reparación de bugs. [S1]

### Ideas concretas

1. **Cadena de artefactos explícita.** Cada fase tiene una entrada y un
   resultado reconocible. Esto facilita saber qué debe leer el agente y qué
   evidencia debe dejar.
2. **Converge como bucle, no como inspección informal.** La comparación entre
   artefactos y código es una fase separada de la implementación.
3. **Análisis de consistencia antes de implementar.** `analyze` revisa
   coherencia y cobertura entre artefactos; puede ser un gate previo a la
   ejecución. [S1]
4. **Extensiones frente a presets.** Las extensiones añaden capacidades o
   flujos; los presets cambian cómo se representan las especificaciones,
   planes y tareas. Esta diferencia evita usar un mecanismo de personalización
   para un problema de funcionalidad. [S1]
5. **Investigación como entrada del plan.** La documentación del flujo indica
   que `research.md`, modelos de datos, contratos y quickstarts pueden alimentar
   la generación de tareas. [S2]
6. **Marcadores de incertidumbre.** El enfoque recomienda hacer visibles las
   ambigüedades en lugar de rellenarlas con suposiciones plausibles. [S2]

### Qué no copiar sin más

- Spec Kit trata la especificación como artefacto primario y el código como su
  expresión. Krill actualmente usa documentación y código como fuentes de
  verdad según el área; adoptar una inversión completa requeriría una decisión
  de arquitectura, no solo cambiar nombres de comandos.
- Constituciones, extensiones, presets, bundles y numerosos comandos pueden ser
  excesivos para un skeleton pequeño.
- La instalación está diseñada para varios harnesses y usa un CLI propio. Krill
  puede adoptar los gates sin adoptar ese CLI ni su estructura de carpetas.

## 3. Warp: `skill-doctor`

### Qué hace

`skill-doctor` evalúa la configuración de un agente a partir de conversaciones
locales. Primero pide qué conversaciones y skills analizar, después recopila
sesiones, puntúa eficiencia y calidad del código, calcula cobertura de skills y
genera propuestas de cambios. El reporte incluye hallazgos, sugerencias y un
diff de la skill propuesta. [W1]

Tiene dos propiedades especialmente relevantes:

- **Privacidad por diseño:** indica que los transcripts y sesiones no se suben;
  todo el análisis se ejecuta localmente y solo el reporte elegido es
  compartible. [W1]
- **Evaluación basada en evidencia:** una skill no se considera buena solo por
  estar bien escrita; se observa si se activa y si cambia el resultado de
  conversaciones reales. [W1]

### Ideas concretas

1. Auditar periódicamente si una skill se activa cuando debe y no se activa
   cuando no debe.
2. Relacionar cada mejora de una skill con una sesión y un fallo observado.
3. Separar el score de eficiencia, calidad y cobertura, en vez de convertirlo
   todo en una opinión única.
4. Proponer un diff revisable sin modificar automáticamente las skills reales.

### Recomendación para Krill

Usarlo como herramienta externa y opt-in durante la evolución del skeleton, no
como una skill permanente obligatoria de Krill. Antes de usarlo en un entorno
real habría que confirmar el harness soportado, la ubicación de las sesiones y
la política de privacidad del entorno. No debería analizar conversaciones de
otros proyectos por defecto ni enviar transcripts a servicios externos.

## 4. `luchasarie/bro-skill`

### Qué hace

`bro` tiene un alcance muy estrecho: cuando el usuario escribe `/bro`, vuelve a
explicar el mensaje anterior con palabras más sencillas. Sus reglas impiden
responder una pregunta nueva, obligan a conservar nombres, rutas, comandos y
decisiones, y piden mantener el idioma y aplanar la estructura. [B1]

### Ideas concretas

1. Una skill debe tener un disparador que el agente pueda reconocer sin
   ambigüedad.
2. Una tarea pequeña se beneficia más de límites claros que de un workflow
   general.
3. Las restricciones útiles deben proteger el contrato observable, por
   ejemplo conservar comandos y rutas, no describir una implementación interna.

### Recomendación para Krill

No parece aportar una capacidad que Krill necesite incorporar. Sí sirve como
referencia de diseño: antes de crear una skill grande, comprobar si el problema
real puede resolverse con una skill atómica con una entrada, una salida y unas
reglas verificables.

## 5. Referencia adicional: `obra/superpowers`

### Qué hace

Superpowers combina un conjunto de skills con instrucciones de arranque y
soporte para varios agentes. Su flujo básico pasa por brainstorming,
worktrees, planes pequeños, ejecución, TDD, revisión y cierre de la rama. [P1]

Su patrón más distintivo es `subagent-driven-development`: crea un subagente
fresco por tarea, ejecuta una revisión de cumplimiento de especificación y
calidad después de cada tarea y hace una revisión amplia al final. También
separa la revisión de la especificación de la revisión de calidad. [P2]

El repositorio incluye además una guía para escribir y probar skills. Trata la
creación de una skill como un ciclo parecido a TDD: escenario de presión sin la
skill, skill mínima, repetición con la skill y cierre de nuevas vías de escape.
También recomienda que la descripción sirva para descubrir cuándo usarla, sin
resumir todo el workflow. [P3]

### Ideas concretas

1. **Contexto fresco para revisiones.** Una revisión independiente tiene menos
   riesgo de aceptar las decisiones que tomó el mismo agente implementador.
2. **Tareas pequeñas y verificables.** Los planes deben poder ejecutarse en
   unidades breves con pasos de verificación explícitos.
3. **Dos revisiones diferentes.** Cumplimiento de requisitos y calidad son
   preguntas distintas.
4. **Probar las skills.** Las skills que imponen disciplina deben probarse con
   escenarios que ejerzan presión, no solo revisarse visualmente.
5. **Verificación antes de declarar terminado.** El cierre comprueba el estado
   real de tests, cambios y rama.

### Qué no copiar sin más

- Worktrees, subagentes por tarea y múltiples rondas de revisión aumentan el
  coste operativo. Conviene activarlos según tamaño, riesgo o aislamiento de
  contexto, no para cada cambio trivial.
- Su instalación y hooks dependen del harness. Krill debe conservar comandos
  que funcionen en OpenCode sin depender de un plugin externo.
- La regla de TDD para skills puede ser demasiado pesada para documentación
  puramente informativa; es más adecuada para skills que intentan cambiar el
  comportamiento del agente.

## Comandos, skills y agentes: no son equivalentes

Las referencias no usan siempre los mismos nombres para las mismas piezas.

### Comandos

Son entradas visibles para el usuario y suelen orquestar varias lecturas,
decisiones o pasos. Spec Kit los usa como fases explícitas; Matt Pocock tiene
skills invocables por el usuario que cumplen una función parecida; Krill usa
archivos `.opencode/commands/`.

### Skills

Son instrucciones reutilizables sobre una técnica, disciplina o patrón. Pueden
ser invocadas explícitamente o descubiertas por el modelo. Una skill no debería
convertirse automáticamente en un estado del ciclo de vida ni duplicar el
comando que la usa.

### Agentes

Un agente especializado aporta un contexto, rol o perspectiva de ejecución.
Superpowers usa subagentes frescos para aislar tareas y revisiones. Spec Kit se
centra más en integraciones, comandos y artefactos que en mantener un catálogo
de agentes de negocio. La ausencia de agentes personalizados en Krill no es
por sí misma una carencia: solo merece introducirlos cuando la independencia,
el aislamiento de contexto o la especialización produzcan una mejora medible.

### Artefactos

Son la memoria persistente del proceso. Aquí está la diferencia más importante
para Krill: una skill puede volver a leerse, pero solo un artefacto permite
reanudar, auditar y comparar el estado de una tarea entre sesiones.

## Qué adoptaría en Krill

Estas son recomendaciones ordenadas por relación beneficio/complejidad. No son
cambios ya aprobados.

### Prioridad alta

1. **Añadir una capacidad de investigación reutilizable.** Debe producir un
   único Markdown con pregunta, fuentes primarias, observaciones, implicaciones
   para Krill, recomendaciones, incertidumbres y fecha de consulta. La
   investigación actual sigue el patrón de la skill `research` de Matt Pocock:
   no modificar el código automáticamente y citar cada afirmación. [M2]
2. **Definir un gate de consistencia antes de implementar.** Revisar que el
   plan, las tareas, los documentos fuente y los criterios de aceptación no se
   contradicen. Es una versión pequeña de `analyze` de Spec Kit y debería
   devolver bloqueos concretos, no una puntuación ornamental. [S1]
3. **Mantener converge como fase separada.** Debe producir evidencia por cada
   criterio y poder generar trabajo pendiente si el resultado no coincide con
   el plan. Esta es la idea más directamente reutilizable de Spec Kit. [S1]
4. **Separar revisión de especificación y revisión de calidad.** La revisión de
   una tarea puede usar dos perspectivas independientes, como hacen Matt
   Pocock y Superpowers, sin necesidad de crear dos comandos públicos. [M3]
5. **Formalizar el artefacto de reanudación.** El archivo de tarea debería
   conservar de forma explícita fase, siguiente paso, bloqueos, última
   validación y cambios de alcance. La ubicación del archivo y el estado deben
   tener una semántica única.

### Prioridad media

6. **Crear una revisión opt-in de skills.** Tomar `skill-doctor` como referencia
   para analizar sesiones locales, activación, utilidad y fallos observados.
   Debería generar propuestas revisables y no editar skills ni subir
   conversaciones automáticamente. [W1]
7. **Probar skills de disciplina con escenarios de presión.** Aplicarlo a TDD,
   closeout, revisión y otras skills que intenten evitar atajos. Para una skill
   de referencia o una transformación simple, bastaría con casos de recuperación
   y aplicación correcta.
8. **Usar agentes especializados de forma selectiva.** Los primeros candidatos
   serían investigación y revisión independiente. No conviene crear agentes
   para cada fase si el mismo comando puede ejecutar la tarea con suficiente
   claridad.
9. **Añadir incertidumbre explícita a los planes.** Usar preguntas abiertas o
   marcadores inequívocos cuando falte información, en vez de dejar que el
   agente complete silenciosamente el hueco. [S2]

### No adoptar de momento

10. **No incorporar bundles, presets, múltiples plugins ni un catálogo grande de
    agentes.** Son extensibilidad para un ecosistema mayor; no resuelven por sí
    mismos los problemas de reanudación o trazabilidad de Krill.
11. **No convertir cada revisión en un subagente.** Aplicar paralelización solo
    cuando el diff, el riesgo o el tamaño justifiquen el coste.
12. **No hacer obligatoria `skill-doctor`.** Es más útil como instrumento de
    diagnóstico periódico que como paso fijo de cada tarea.

## Propuesta de flujo mínimo inspirado en las referencias

Sin cambiar todavía la estructura de Krill, el flujo conceptual podría quedar
así:

```text
petición
  -> aclarar incertidumbres y vocabulario
  -> investigar si hay decisiones externas relevantes
  -> plan con criterios y riesgos
  -> análisis de consistencia
  -> ejecución TDD por unidades pequeñas
  -> converge contra plan y criterios
  -> revisión independiente de especificación y calidad
  -> cierre con resumen histórico solo si aporta conocimiento durable
```

La investigación y el análisis de consistencia son condicionales: no hay que
crear documentos ni convocar agentes cuando la tarea es trivial y no contiene
decisiones externas. La regla debe ser observable, por ejemplo: “si hay una
decisión técnica, dependencia externa, incertidumbre de contrato o comparación
entre alternativas, se genera investigación; en caso contrario se registra que
no aplica”.

## Preguntas para validar antes de aplicar cambios

- ¿Debe Krill considerar el archivo de tarea como la única fuente de estado, o
  pueden los comandos inferir estado desde la ubicación y el historial Git?
- ¿Dónde deben vivir las investigaciones de cada tarea: junto a la tarea, en un
  área temporal o en documentación durable?
- ¿Qué tamaño o riesgo justifica lanzar subagentes independientes?
- ¿Qué evidencias mínimas hacen que una skill se considere útil: activación,
  cumplimiento, reducción de errores, ahorro de tokens o una combinación?
- ¿Qué skills de Krill son de disciplina y necesitan escenarios de presión, y
  cuáles son únicamente de referencia?
- ¿Debe la revisión separada de especificación y calidad ser visible como dos
  comandos o permanecer como dos perspectivas internas de una revisión única?

## Fuentes consultadas

### Fuentes principales

- **[M1] Matt Pocock, `skills` README:**
  https://github.com/mattpocock/skills/blob/main/README.md
- **[M2] Matt Pocock, skill `research`:**
  https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md
- **[M3] Matt Pocock, skill `code-review`:**
  https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md
- **[S1] GitHub, Spec Kit README:**
  https://github.com/github/spec-kit/blob/main/README.md
- **[S2] GitHub, Spec Kit `spec-driven.md`:**
  https://github.com/github/spec-kit/blob/main/spec-driven.md
- **[W1] Warp, skill `skill-doctor`:**
  https://github.com/warpdotdev/common-skills/blob/main/.agents/skills/skill-doctor/SKILL.md
- **[B1] luchasarie, `bro-skill`:**
  https://github.com/luchasarie/bro-skill/blob/main/SKILL.md
- **[P1] obra, Superpowers README:**
  https://github.com/obra/superpowers/blob/main/README.md
- **[P2] obra, skill `subagent-driven-development`:**
  https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md
- **[P3] obra, skill `writing-skills`:**
  https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md

### Alcance de las fuentes

La comparación se basa principalmente en README y skills de proceso. No se
auditaron todos los scripts, integraciones, issues, releases ni el comportamiento
de cada herramienta en todos los harnesses. Antes de convertir una recomendación
en una regla de Krill conviene validar el comportamiento real con un proyecto de
prueba y fijar versiones o commits de las referencias relevantes.
