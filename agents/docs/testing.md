# Guía de Pruebas (Testing Guide)

Personalizar antes de la implementación del producto. Si un comando no está disponible, escribir `not available` y explicar la alternativa.

Este archivo define la logística de pruebas específica del proyecto. Usar `agents/skills/test-driven-development/SKILL.md` como autoridad para el flujo de trabajo TDD en sí mismo.

## Comandos

### Rápidos (ciclo TDD / pre-commit)
| Propósito | Comando |
|---|---|
| Unitarias dirigidas | |
| Unitarias completas | |
| Lint | |
| Typecheck | |

### Lentos (pre-merge / CI)
| Propósito | Comando |
|---|---|
| Integración | |
| E2E | |
| Build | |
| Validación completa | |
| Informe de cobertura | |
| Lint de DESIGN.md | `npx @google/design.md lint agents/docs/design.md` (requiere Node.js; opcional — omitir si no está disponible) |

## Niveles de Prueba
| Nivel | Propósito | Aislamiento | Cuándo ejecutar |
|---|---|---|---|
| Unitarias | Lógica de negocio, funciones puras, componentes aislados | Sin red, sin BD, sin IO | Cada ciclo TDD |
| Integración | Interacción entre capas (repositorio + servicio, API + BD) | Mock en límites externos, BD real o testcontainers para BD del proyecto | Pre-commit / CI |
| E2E | Flujo completo (UI → API → BD → respuesta) | Entorno real o staging | CI / pre-release |

## Cobertura
| Ítem | Configuración |
|---|---|
| Herramienta | |
| Umbral | |
| Comando | |
| Rutas excluidas | |
| Fallar por debajo del umbral | sí / no |

## Entorno
- Servicios requeridos:
- Variables de entorno requeridas:
- Reinicio/limpieza:

## Fixtures
| Tipo | Ubicación | Cuándo se usa |
|---|---|---|
| Unitarias (factories, builders, mocks) | | Pruebas unitarias |
| Integración (datos semilla, snapshots de BD) | | Pruebas de integración |
| E2E (usuarios de prueba, datos sandbox) | | Pruebas E2E |
| Utilidades compartidas | | Todos los niveles |

## Estrategia para Servicios Externos
| Nivel | Estrategia |
|---|---|
| Unitarias | Siempre mock o stub |
| Integración | BD del proyecto: real. APIs de terceros: mock o testcontainer |
| E2E | Entorno de staging o sandbox |

## Ubicaciones de las Pruebas
- Unitarias:
- Integración:
- E2E:

## Coordinación TDD
- Leer y aplicar la skill de TDD una vez antes del código de implementación cuando la tarea cambie comportamiento o refactorice código que preserva comportamiento.
- Usar los comandos y ubicaciones de esta guía mientras se sigue el ciclo red/green/refactor de la skill.
- Registrar cualquier excepción TDD aprobada en el plan de tarea y en la checklist antes de implementar bajo esa excepción.

## Calidad de las Pruebas
- Preferir fixtures deterministas.
- Evitar estado mutable compartido y pruebas que dependen del orden.
- Mantener datos sensibles o similares a producción fuera de los fixtures.
- Mockear servicios externos en los límites; preferir código real para la lógica de dominio.
- No afirmar solo sobre llamadas a mocks cuando se pueda afirmar sobre comportamiento visible para el usuario.

## Manejo de Fallos
- Corregir fallos inesperados en pruebas dirigidas antes de continuar.
- Reportar fallos no relacionados antes de ampliar el alcance.
- Registrar comandos omitidos, motivos y riesgo residual.
