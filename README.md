# PrawnForms

Formulario de captación de solicitudes con panel de seguimiento interno. Centraliza la recepción y gestión de leads provenientes de un formulario público, evitando que los contactos queden dispersos en correos, mensajes o registros manuales.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | PHP 8.3 |
| Framework | Laravel 13 |
| Panel admin | Filament 5 |
| CSS | Tailwind CSS 4 |
| Frontend build | Vite 8 |
| Testing | Pest 4 / PHPUnit 12 |
| BD local | SQLite |
| BD producción | PostgreSQL |
| Correo | Resend (pendiente de configurar) |

## Funcionalidades

### Público

- **Formulario de contacto** en `/` con campos: nombre, email, teléfono, empresa, tipo de necesidad (desplegable), mensaje y consentimiento.
- **Protección anti-spam**: honeypot invisible + rate limiting (5 envíos/IP/minuto).
- **Página de confirmación** en `/gracias` tras el envío exitoso.

### Panel de administración (`/admin`)

- **Autenticación** con login y logout Filament.
- **Control de acceso**: solo usuarios con `activo = true` pueden acceder.
- **Listado de solicitudes** (`/admin/leads`) con columnas: nombre, email, empresa, tipo de necesidad, estado, responsable y fecha de creación. Orden descendente por defecto.
- **Filtros combinables**: por estado, tipo de necesidad, texto libre (nombre, email, empresa, teléfono, mensaje), rango de fecha y responsable.

### Modelos preparados (pendientes de UI)

- Notas internas y eventos de auditoría con modelos y migraciones listas.

## Instalación

```bash
git clone <repo-url>
cd krill

# Opción 1: setup completo
composer run-script setup

# Opción 2: paso a paso
cp .env.example .env
php artisan key:generate
composer install
npm install && npm run build
php artisan migrate
php artisan db:seed
```

El seeder crea un usuario administrador por defecto:
- **Email**: `admin@prawnforms.test`
- **Contraseña**: `password`

## Uso

```bash
# Desarrollar con recarga en caliente
composer run dev

# Ejecutar tests
composer test

# Servidor simple
php artisan serve
```

Accede a `http://127.0.0.1:8000` para el formulario público y a `http://127.0.0.1:8000/admin` para el panel.

## Estructura del proyecto

```
├── app/
│   ├── Enums/              # LeadStatus, TipoNecesidad
│   ├── Filament/
│   │   └── Resources/      # LeadResource (listado + filtros)
│   ├── Http/Controllers/   # PublicLeadController
│   ├── Models/             # Lead, User, NotaInterna, EventoAuditoria
│   └── Providers/          # AdminPanelProvider
├── config/                 # Configuración de Laravel
├── database/
│   ├── factories/          # LeadFactory, UserFactory, etc.
│   ├── migrations/         # 7 migraciones
│   └── seeders/            # DatabaseSeeder
├── resources/
│   └── views/              # formulario.blade.php, confirmacion.blade.php
├── routes/
│   └── web.php             # GET /, POST /, GET /gracias
└── tests/
    ├── Feature/            # 15 archivos de tests funcionales
    └── Unit/               # 2 archivos de tests unitarios
```

## Tests

Más de 55 tests que cubren:

- Modelos, relaciones y enums
- Validación del formulario público
- Anti-spam (honeypot + rate limiting)
- Autenticación Filament (acceso, logout, invitados, inactivos)
- Listado paginado de leads
- Filtros combinables (estado, tipo, texto, fechas, responsable)

```bash
composer test
```

## Contribuir

Este repositorio sigue un flujo SDD/TDD con checklist por tarea. Las decisiones de diseño y reglas del proyecto se documentan como fuente de verdad. Consulta `AGENTS.md` para conocer el flujo de trabajo.

## Licencia

MIT. Ver [LICENSE](LICENSE).
