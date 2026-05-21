# API Contracts

Mark as `Not applicable` if the project exposes no public API.

Document only public contracts that clients depend on.

## Conventions
- Base URL:
- Auth:
- Error format:
- Pagination:
- Versioning/compatibility:

## Routes
| Method | Path | Request | Response | Notes |
|---|---|---|---|---|
| `POST` | `/` | Form HTML con `nombre`, `email`, `telefono`, `empresa`, `tipo_necesidad`, `mensaje`, `consentimiento` | `302` redirect a `/` con errores de sesión o flash `status` en éxito | Endpoint público del formulario de captación. `tipo_necesidad` debe coincidir con `TipoNecesidad` enum. |

## Compatibility Notes
- El formulario público usa submit tradicional HTML, no JSON.
- Mientras TASK-005 no exista, el éxito vuelve a `/` con mensaje flash.
