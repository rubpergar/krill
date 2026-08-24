---
name: cpp-best-practices
description: C++ and Qt code quality guide for the group's C++/Qt repositories (e.g. peticiones_qmonitor, qmonitor, qthinc, nodovirtual). Use when generating new C++/Qt code, modifying existing C++/Qt code, doing behavior-preserving refactors, or reviewing C++/Qt code for performance, resource usage, safety, or maintainability. Do not use for non-C++ repositories or for general business-logic debugging without C++ scope.
---

# C++/Qt Best Practices

## Internal Modifications
Modified by: RPG
Date: 2026-08-24
Purpose: Consolidated and adapted the group's C++/Qt coding guidance. Based on "Performance by Design: A C++ Guide" (@int_16h, https://cpp-guide-for-agents.irrotational.com/) and its distilled form "C++ Performance Principles for Agents" (gist by aean0x, https://gist.github.com/aean0x/2d365f4782f899ac2c132e742e74542d), plus the project conventions and C++ Core Guidelines. Project-specific CAD/CSG examples removed and the content adapted to our Qt/C++ service architecture.
Distribution: Internal use only unless licenses are reviewed before redistribution.
Original source/license: see `agents/skills/README.md` (references by @int_16h and aean0x).

Guía de calidad para el código C++/Qt de nuestros proyectos (Qt 6.10.1, C++17, qmake). Se aplica a repositorios C++/Qt y se usa al generar, modificar, refactorizar o revisar código. Las directrices del proyecto y los planes de tarea aprobados prevalecen sobre esta guía cuando entren en conflicto.

## Principio rector

- La API pública puede ser expresiva; la implementación interna debe ser explícita.
- Haz que el coste sea visible: cada byte movido, cada asignación, cada rama y cada bucle debe ser intencional.
- No confíes en el compilador para borrar malas estructuras de datos, asignaciones, copias, formateo de strings, dispatch dinámico o mala complejidad algorítmica.
- Mide antes de optimizar: primero la forma algorítmica y de datos, después los micro-optimizaciones locales.
- Los proyectos son servicios I/O-bound (sockets TCP + MySQL + hilos). Las reglas de rendimiento de bucles numéricos intensivos se aplican sobre todo a los caminos que se ejecutan por conexión, por petición o en bucles internos; no como optimización prematura global.

## Qué usar de C++

- `namespace`, `enum class`, `constexpr`, referencias para entradas requeridas, `nullptr`, plantillas simples para variantes de tamaño fijo, sobrecarga de operadores en la API pública cuando mejore la legibilidad.
- RAII en las fronteras de ownership (`std::unique_ptr`, `std::shared_ptr` cuando haya propiedad compartida, guardas de transacción, `QMutexLocker`).
- `static_assert` para proteger contratos de layout cuando aplique.

## Ownership y gestión de recursos (C++ Core Guidelines R.1, R.11, R.20, R.21, R.23)

- Usa ownership RAII con smart pointers en lugar de `new`/`delete` manuales (R.11).
- Prefiere `std::make_unique`/`std::make_shared` (R.23).
- Declara objetos con ownership exclusivo como `std::unique_ptr`; conserva el orden de miembros que garantice una destrucción inversa segura.
- En código Qt, usa el parentado de objetos QObject y `deleteLater` para objetos con hilos/eventos; no destruyas manualmente objetos que aún viven en el event loop.
- `unique_ptr` con tipos incompletos: asegura una definición de destructor válida en el punto donde se destruye el objeto.
- Evita punteros crudos propietarios en registros o buffers que se copian/barren; si no puede `memcpy`, es una señal de diseño a revisar.

## Asignaciones, copias y datos calientes

- No asignes en bucles que se ejecuten por conexión, por petición o por elemento: usa buffers retenidos/workspaces reutilizados cuando haya un hotspot medido.
- Evita copias profundas ocultas de objetos que contengan contenedores o strings en caminos calientes; pasa por referencia (`const T&`) o por valor solo cuando la semántica lo requiera.
- Evita `std::vector<std::vector<T>>` y anidamientos de contenedores en caminos repetidos; prefiere buffers planos con offsets/prefix-sum si el problema lo amerita (solo con hotspot medido).
- En datos "calientes" (los que usa el algoritmo repetidamente), mantén campos numéricos compactos y referencias a tablas frías por ID; mueve strings/provenance/diagnóstico a tablas frías.
- Las strings son datos de presentación, no identidad caliente: evita `ostringstream` y formateo en el camino de éxito.

## Estructura de datos y algoritmos

- Elige la forma algorítmica antes que el layout: cuando el perfil muestra una fase repetida, pregunta primero si puede eliminarse, agruparse o reordenarse bajo un invariante claro; solo afina el bucle local después.
- Prefiere rutinas especializadas y dispatch por tipo una vez en la parte alta del flujo, en lugar de ramas por elemento dentro del bucle más profundo.
- No introduzcas abstracciones genéricas "elegantes" que escondan asignación/copias o que generalicen call sites con necesidades de rendimiento distintas.
- Una abstracción es buena si elimina complejidad real, mantiene ownership y asignación visibles, preserva o mejora el rendimiento medido, tiene un contrato estrecho y hace más fácil la siguiente implementación similar.

## Corrección y seguridad

- Usa `enum class` y evita casts inseguros; comprueba los retornos de operaciones (conexión, escrituras, `QDataStream::status()`, cargas BD) antes de usarlos.
- Maneja errores con estados/resultados explícitos y códigos (patrón de `ResultadoXxx` del proyecto) en lugar de excepciones como flujo de control normal.
- Aplica la skill `security-review` para aspectos de seguridad (inyección SQL, entrada de usuario, deserialización, secrets); no la dupliques aquí.
- Mantén los comentarios en español, concisos y con intención (convención del proyecto, ADR-002 para mensajes de log).

## Concurrencia Qt

- Evita `QThread::terminate()` (no ejecuta destructores y deja estado inconsistente); usa señales `finished` + `quit` + `deleteLater` y apagado cooperativo.
- Prefiere worker-QObject movido a `QThread` sobre heredar `QThread` cuando no haya necesidad de reimplementar `run()`.
- Protege estado compartido entre hilos con `QMutex`/`QWaitCondition`/atómicos (`std::atomic`); evita carreras y resultados perdidos.

## Antirreglas (qué NO hacer por defecto)

- No uses `new`/`delete` manuales sin RAII.
- No uses strings como identidad en bucles/keys calientes.
- No confíes en `unordered_map`/`map` ni en contenedores "reutilizables" genéricos si un ID table o estructura especializada es más adecuada (solo con hotspot medido).
- No introduzcas virtual dispatch por elemento ni jerarquías pesadas en kernels calientes.
- No "optimices" sin medir: registra el antes/después y los intentos rechazados.
- No copies reglas de rendimiento genéricas (arenas, `malloc`/`alloca`, prefix-sum) literalmente a un servicio I/O-bound sin un hotspot que las justifique.

## C++ Core Guidelines

Usa las C++ Core Guidelines (https://isocpp.github.io/CppCoreGuidelines/) como referencia general de corrección, seguridad y mantenibilidad. Reglas relevantes citadas con frecuencia en nuestros proyectos: R.1, R.11, R.20, R.21, R.23, P.1, P.11, I.1, I.23, SF.1.

## Checklist de revisión

### Nivel local
- [ ] ¿Pasa los tests?
- [ ] ¿Preserva la semántica observable?
- [ ] ¿Solo se tocaron archivos propios de la tarea?

### Nivel de arquitectura
- [ ] ¿Está en el subsistema correcto?
- [ ] ¿Se introdujo ownership o asignación en un futuro camino caliente?
- [ ] ¿Se eligieron contenedores estándar por conveniencia sin justificación?
- [ ] ¿Se mezclaron datos calientes con metadatos fríos?
- [ ] ¿El cambio es aplicable al siguiente subsistema sin degradar el rendimiento?
