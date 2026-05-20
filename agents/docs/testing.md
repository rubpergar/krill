# Guía de Pruebas

Personaliza antes de la implementación del producto. Si un comando no está disponible, escribe `not available` y explica la alternativa.

Este archivo define la logística de pruebas específica del proyecto. Usa `agents/skills/test-driven-development/SKILL.md` como la autoridad para el flujo de trabajo TDD en sí.

## Comandos

### Rápidos (ciclo TDD / pre-commit)
| Propósito | Comando |
|---|---|
| Pruebas unitarias específicas | |
| Pruebas unitarias completas | |
| Lint | |
| Verificador de tipos | |

### Lentos (pre-fusión / CI)
| Propósito | Comando |
|---|---|
| Integración | |
| E2E | |
| Compilación | |
| Validación completa | |
| Informe de cobertura | |
| Lint de DESIGN.md | `npx @google/design.md lint agents/docs/design.md` (requiere Node.js; opcional — saltar si no está disponible) |

## Niveles de Prueba
| Nivel | Propósito | Aislamiento | Cuándo ejecutar |
|---|---|---|---|
| Unitarias | Lógica de negocio, funciones puras, componentes aislados | Sin red, sin BD, sin E/S | Cada ciclo TDD |
| Integración | Interacción entre capas (repositorio + servicio, API + BD) | Mock en límites externos, BD real o testcontainers para BD del proyecto | Pre-commit / CI |
| E2E | Flujo completo (UI → API → BD → respuesta) | Entorno real o staging | CI / pre-lanzamiento |

## Cobertura
| Elemento | Configuración |
|---|---|
| Herramienta | |
| Umbral | |
| Comando | |
| Rutas excluidas | |
| Fallar por debajo del umbral | yes / no |

## Entorno
- Servicios requeridos:
- Variables de entorno requeridas:
- Reinicio/limpieza:

## Fixtures
| Tipo | Ubicación | Cuándo se usa |
|---|---|---|
| Unitarias (fábricas, constructores, mocks) | | Pruebas unitarias |
| Integración (datos semilla, snapshots de BD) | | Pruebas de integración |
| E2E (usuarios de prueba, datos sandbox) | | Pruebas E2E |
| Utilidades compartidas | | Todos los niveles |

## Estrategia de Servicios Externos
| Nivel | Estrategia |
|---|---|
| Unitarias | Siempre mock o stub |
| Integración | BD del proyecto: real. APIs de terceros: mock o testcontainer |
| E2E | Entorno staging o sandbox |

## Ubicaciones de Pruebas
- Unitarias:
- Integración:
- E2E:

## Coordinación TDD
- Lee y aplica la skill de TDD una vez antes del código de implementación cuando la tarea cambie comportamiento o refactorice código que preserva comportamiento.
- Usa los comandos y ubicaciones de esta guía mientras sigues el ciclo red/green/refactor de la skill.
- Registra cualquier excepción de TDD aprobada en el plan y la lista de verificación de la tarea antes de implementar bajo esa excepción.

## Calidad de las Pruebas
- Prefiere fixtures deterministas.
- Evita estado mutable compartido y pruebas que dependen del orden.
- Mantén datos sensibles o similares a producción fuera de los fixtures.
- Mockea servicios externos en los límites; prefiere código real para la lógica de dominio.
- No asserts solo sobre llamadas a mocks cuando se pueda afirmar sobre el comportamiento visible para el usuario.

## Manejo de Fallos
- Corrige fallos inesperados en pruebas específicas antes de continuar.
- Reporta fallos no relacionados antes de ampliar el alcance.
- Registra comandos omitidos, motivos y riesgo residual.
