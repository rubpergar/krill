# Task Plan TASK-007

## Status
`draft`

## Task
- ID: TASK-007
- Title: Implementar interfaz bento responsive conectada a la API
- Backlog source: `agents/task/backlog.md`

## Summary
El frontend es un esqueleto vacío (solo un `<h1>` en App.tsx). Se implementarán las páginas base de autenticación (login, registro) y el dashboard principal con diseño bento grid, conectados a la API vía un service layer. Se establece la arquitectura frontend: routing, auth context, API client y design tokens.

## Scope

**In:**
1. Dependencias nuevas: `react-router-dom` v7, `lucide-react` (iconos)
2. Design tokens en Tailwind config: paleta oscura (neutral-950 fondo, primary accent, surface cards)
3. API service layer (`src/services/api.ts`): fetch wrapper con token Bearer, métodos `register`, `login`, `getMe`, `getIncidents`, `createIncident`
4. Auth context (`src/contexts/AuthContext.tsx`): estado de sesión, login/logout, persistencia de token en localStorage
5. Ruta pública (`/login`): formulario de inicio de sesión con email + password
6. Ruta pública (`/register`): formulario de registro con name + email + password
7. Ruta protegida (`/`): dashboard con bento grid que incluye:
   - Card de bienvenida con nombre del usuario
   - Card de estadísticas (total, por estado, por prioridad)
   - Card de incidencias recientes (últimas 5 en lista compacta)
   - Card de acceso rápido "Nueva incidencia" (enlace)
8. `ProtectedRoute` wrapper que redirige a `/login` si no hay sesión
9. Navbar/header simple con logo, nombre de usuario y botón de logout
10. `App.tsx` con React Router, AuthProvider, rutas configuradas

**Out (explicitly excluded):**
- Página de detalle de incidencia — TASK futura
- Formulario completo de creación de incidencia — solo card de acceso rápido
- Panel admin — TASK futura
- Comentarios UI
- Cambio de estado/prioridad desde UI
- Paginación/filtros en dashboard (solo últimas 5)
- Componente test unitarios (se prioriza integración visual)

## Current Behavior
- App.tsx muestra solo un `<h1> "Incidencias Coworking"` centrado
- Sin routing, sin auth, sin API calls, sin componentes
- Sin design tokens configurados en Tailwind

## Target Behavior
- Al cargar, si hay token en localStorage → dashboard bento con datos reales de la API
- Si no hay token → redirect a `/login`
- Login y Register → formularios que llaman a la API y guardan token
- Dashboard: grid responsive de cards con estadísticas, incidencias recientes y acceso rápido
- Navbar con logout

## Acceptance Criteria
1. Login exitoso redirige al dashboard
2. Registro exitoso redirige al dashboard
3. Sin token → redirect a `/login`
4. Dashboard muestra nombre del usuario autenticado
5. Dashboard muestra incidencias del usuario (desde API real)
6. Dashboard tiene layout bento grid responsive (1 col móvil, 2 tablet, 3+ desktop)
7. Logout limpia token y redirige a login
8. Error de API se muestra como toast/notificación
9. Los formularios tienen validación básica (campos requeridos)
10. Navbar visible en todas las páginas protegidas

## Edge Cases
- Token expirado → 401 en API → logout automático + redirect a login
- Error de conexión → mensaje amigable, no crash
- Dashboard sin incidencias → empty state con mensaje y CTA
- Formulario enviando → botón deshabilitado + loading state
- Register con email duplicado → mostrar error de la API

## Assumptions / Risks
- El backend ya está funcionando y expone la API en `/api/v1/*` vía proxy de Vite
- Los tokens JWT se almacenan en localStorage (riesgo XSS aceptado para MVP)
- No se usan librerías de estado externas (solo React Context)
- No se implementan tests de componentes en esta tarea (se prioriza entrega visual funcional)

## Database Impact
Not applicable — frontend.

## Open Questions
Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md` (contratos de endpoints)
- `agents/docs/design.md` (se actualizará con design tokens)

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None
- New decisions to record after user approval: None
