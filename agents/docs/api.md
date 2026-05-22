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
| `POST` | `/` | Form HTML con `nombre`, `email`, `telefono`, `empresa`, `tipo_necesidad`, `mensaje`, `consentimiento` | `302` redirect a `/gracias` en éxito, `429` si supera rate limit, o `302` a `/` con errores de sesión | Endpoint público del formulario de captación. `tipo_necesidad` debe coincidir con `TipoNecesidad` enum. |
| `GET` | `/gracias` | — | `200` HTML de confirmación | Pantalla de confirmación post-envío, pública y genérica, sin datos personales. |

## Compatibility Notes
- El formulario público usa submit tradicional HTML, no JSON.
- El éxito redirige a `/gracias` con PRG; los errores vuelven a `/`.
- GET /gracias es seguro para acceso directo y refresco.
- Honeypot informado se descarta sin exponer datos personales.
- Exceso de frecuencia responde con `429 Too Many Requests`.
