# Domain Model — PrawnForms

## Entidades

### Lead (Solicitud)
Entidad central. Representa una solicitud enviada desde el formulario público.

Campos clave:
- `estado`: enum LeadStatus (Nuevo, Revisado, Contactado, EnSeguimiento, Convertido, Descartado)
- `tipo_necesidad`: enum TipoNecesidad (Consulta, Presupuesto, Colaboración, Soporte, Otro)
- `consentimiento_aceptado`: obligatorio true para guardar
- `archivado`: soft-delete manual

### User (Usuario interno)
Usuario del panel privado. Extiende el modelo Authenticatable de Laravel con:
- `rol`: 'admin' | 'usuario'
- `activo`: permite desactivar acceso sin eliminar

### NotaInterna
Nota de seguimiento asociada a un Lead. Visible solo en el panel privado.

### EventoAuditoria
Registro de trazabilidad ante cambios relevantes (creación, cambio de estado, cambio de responsable, notas).

## Relaciones
- User 1---N Lead (como responsable)
- Lead 1---N NotaInterna
- Lead 1---N EventoAuditoria
- User 1---N NotaInterna (como autor)
- User 1---N EventoAuditoria (como actor)

Un Lead puede no tener responsable. Un EventoAuditoria puede no tener usuario_id (acciones del sistema).

## Reglas de negocio
- Todo lead nuevo se crea con estado 'Nuevo'
- El consentimiento debe ser aceptado explícitamente para guardar
- Si falla el email interno, el lead se guarda igualmente
- Los cambios de estado y asignaciones se registran siempre en EventoAuditoria
- Usuarios internos activos pueden archivar y restaurar solicitudes
- Solo administradores activos pueden eliminar físicamente solicitudes ya archivadas
- La eliminación física de una solicitud borra sus notas y eventos asociados por cascada
