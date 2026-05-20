# Modelo de Dominio

## Entidades
| Entidad | Significado | Notas |
|---|---|---|
| User | Usuario del sistema (cliente o admin) | Se registra con email y password. Rol por defecto 'user'. |
| RefreshToken | Token de refresco JWT persistido | Se almacena hasheado (SHA-256). Se invalida en logout o al rotar. |
| Incident | Incidencia reportada por un usuario | Creada por usuario autenticado. Status por defecto 'open'. Priority por defecto 'medium'. |

## Relaciones
- User 1→* RefreshToken (un usuario puede tener múltiples refresh tokens activos)
- User 1→* Incident (un usuario puede reportar múltiples incidencias como created_by)

## Reglas de Negocio
- El email debe ser único en el sistema.
- La contraseña se almacena hasheada con bcrypt (coste 12).
- El refresh token se rota en cada uso (consumo + emisión nueva).
- Al hacer logout, el refresh token se invalida (borrado físico).

## Glosario
| Término | Significado |
|---|---|
| Access Token | JWT de corta duración (15min) para autenticar requests |
| Refresh Token | Token de larga duración (7d) para renovar el access token |
| bcrypt | Algoritmo de hashing de contraseñas |
| SHA-256 | Algoritmo de hash usado para ofuscar refresh tokens en BD |
