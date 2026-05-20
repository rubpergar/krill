# Plan de Tarea

## Estado
`aprobado`

## Tarea
- ID: TASK-007
- Título: Implementar interfaz bento responsive conectada a la API
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Construir la interfaz de usuario del sistema de incidencias usando React 19 + Tailwind CSS, con un diseño tipo **bento grid** responsivo. Conectar todas las pantallas a los endpoints existentes de la API (`/api/v1/auth/*`, `/api/v1/incidents/*`, `/api/v1/admin/incidents/*`). Cubrir login/register, dashboard de usuario, detalle de incidencia, creación de incidencia, panel de admin con gestión de incidencias, y navegación contextual por roles.

## Alcance

**Incluye:**
- Diseño del sistema de tokens visuales en `agents/docs/design.md` (colores, tipografía, espaciado, bordes, sombras)
- Sistema de autenticación desde el frontend: pantallas de login y registro con validación, manejo de tokens (almacenamiento local), redirect post-auth
- Layout responsivo tipo bento grid (2-4 columnas según viewport) como estructura principal del dashboard
- Navbar/sidebar contextual con enlaces según rol (user vs admin)
- Página de dashboard de usuario: bento grid con cards resumen (total incidencias, abiertas, en progreso, resueltas) + listado paginado de incidencias del usuario
- Página de creación de incidencia (formulario con título, descripción, prioridad)
- Página de detalle de incidencia con estados y asignación visible
- Página de listado admin de incidencias (bento grid con cards de KPIs + tabla global filtrable por status/priority)
- Página de detalle admin de incidencia con acciones: cambiar status, cambiar prioridad, asignar
- Manejo de estados de carga (skeleton loaders), vacío (empty state), error (toast o alerta inline)
- Manejo de expiración de token (redirect a login si 401)
- Componentes UI reutilizables (Button, Input, Card, Badge, Modal, Toast, Skeleton)
- Pruebas unitarias con Vitest + Testing Library para componentes clave (formularios, bento grid, auth flow)
- Pruebas de integración con API mockeada para flujos completos (login → listar → crear → detalle)

**Excluye (explícitamente excluido):**
- Modo oscuro (fuera del MVP, queda registrado como deuda técnica)
- i18n / multi-idioma
- Tests E2E con Playwright/Cypress (se añadirán en tarea separada si aplica)
- PWA / offline support
- SSR / server components (React 19 client-side)
- Cobertura de test 100% en cada componente (priorizar cobertura en lógica de integración y auth)
- Cambios en la API o base de datos existentes
- La librería `framer-motion` existente en package.json no se usará en este MVP; queda disponible para futura iteración de micro-interacciones

## Comportamiento Actual
- El frontend es un placeholder mínimo: `App.tsx` renderiza un encabezado y un mensaje de bienvenida estático.
- No hay autenticación desde el frontend, ni consumo real de la API.
- No hay diseño responsivo ni sistema de componentes.
- `agents/docs/design.md` está vacío (solo placeholders).

## Comportamiento Esperado
- `agents/docs/design.md` define tokens visuales y reglas de UI del proyecto.
- El frontend tiene autenticación completa (login, registro, logout, refresh automático).
- El layout de dashboard usa bento grid responsivo (Tailwind CSS).
- Usuarios pueden crear, listar y ver el detalle de sus incidencias.
- Admins pueden listar todas las incidencias, filtrar, cambiar estado/prioridad/asignación.
- La UI maneja estados: loading, vacío, error, éxito, token expirado.
- Pruebas unitarias e integración pasan.

## Criterios de Aceptación

1. **Login y registro**: formularios funcionales con validación en cliente, llamadas reales a `/api/v1/auth/login` y `/api/v1/auth/register`, almacenamiento de tokens, redirect a dashboard.
2. **Dashboard usuario bento**: grid responsivo con cards de resumen (incidencias totales, abiertas, en progreso, resueltas) + tabla de incidencias del usuario paginada.
3. **Crear incidencia**: formulario con título, descripción, selector de prioridad; POST a `/api/v1/incidents`; redirect al detalle tras creación.
4. **Detalle incidencia usuario**: muestra todos los campos de la incidencia con ownership check visual (si no es del usuario, redirige o muestra error).
5. **Dashboard admin bento**: grid con KPIs globales + tabla de todas las incidencias con filtros por status y priority.
6. **Detalle admin incidencia**: muestra datos completos + acciones para cambiar status, prioridad, asignar.
7. **Navegación contextual**: navbar diferente para usuarios autenticados vs no autenticados; enlaces de admin visibles solo para role admin.
8. **Manejo de errores**: toast/alerta en fallos de API, redirect a login en 401, feedback inline en formularios.
9. **Estados de carga**: skeleton loaders mientras se cargan datos; empty state si no hay incidencias.
10. **Tokens**: access token almacenado en memoria/localStorage, refresh automático al expirar, logout invalida token.
11. **Pruebas**: al menos 1 test unitario por componente principal; test de integración para flujo login → listar → crear.

## Casos Borde
- Token expirado durante una petición activa → interceptar 401, refrescar, reintentar; si refresh falla, logout forzado.
- Usuario no admin navega a ruta `/admin/*` → redirigir a dashboard con mensaje.
- Usuario ve incidencia de otro usuario por URL directa a `/incidents/:id` → la API responde 404 (ownership check en backend); frontend muestra "no encontrada".
- Crear incidencia con prioridad no válida (validación cliente + servidor).
- Lista de incidencias vacía → empty state con ilustración/mensaje y llamado a acción "Crear primera incidencia".
- Paginación: página 1 con menos de `limit` resultados; página solicitada más allá del total → mostrar vacío.
- Filtros combinados en admin (status + priority) → ambos parámetros en query string.
- Doble clic en submit del formulario → deshabilitar botón mientras se envía.
- Refresh con pestaña abierta por días → refresh token también puede expirar (7d).

## Supuestos / Riesgos
- El proxy de Vite (`/api` → `http://localhost:3001`) es suficiente para desarrollo; producción requerirá configuración de reverse proxy.
- `localStorage` para tokens es aceptable para MVP; riesgo XSS manejado vía sanitización de entradas.
- El esquema de incidencias y rutas API actuales (TASK-001 a TASK-006) son estables y no cambiarán durante esta tarea.
- La librería `@tanstack/react-query` se usará para data fetching, caché y estados (evita estado manual de loading/error).
- `react-router-dom` v7 con `BrowserRouter` para navegación SPA.

## Impacto en Base de Datos
No aplica.

## Preguntas Abiertas
- ¿Colores/identidad visual del proyecto o usamos Tailwind defaults (neutral/slate)? → Se usará paleta Tailwind neutral + blue como primario, documentado en `design.md` tras validación.

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/design.md`
- `agents/docs/api.md`
- `agents/skills/interface-design/SKILL.md`

## Registros de Decisiones
- ADRs leídos de `agents/docs/decisions.md`: No hay ADRs registrados aún.
- Nuevas decisiones a registrar después de la aprobación del usuario:
  - ADR-001: Diseño de UI basado en Tailwind CSS con bento grid responsivo (tokens en `design.md`).
  - ADR-002: `@tanstack/react-query` para data fetching con estado global de caché.
  - ADR-003: `react-router-dom` v7 para enrutamiento SPA con protección de rutas por rol.
  - ADR-004: `localStorage` para persistencia de tokens (accesos + refresh) con renovación automática por interceptor 401.
