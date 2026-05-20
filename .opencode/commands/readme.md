---
description: Generate or overwrite the project README.md
---

Genera un README.md completo para este proyecto.

Enfoque o tono opcional para el README: `$ARGUMENTS`

Rules:
- Escanea la estructura completa del proyecto para entenderlo.
- Excluye el directorio `agents/` y todo lo que contiene de la descripción.
- Detecta el stack tecnológico, el propósito del proyecto y las características principales a partir del código existente.
- Incluye secciones estándar: título, descripción, stack, instalación, uso, estructura de directorios (excluyendo `agents/`), contribución, licencia.
- Si se proporciona `$ARGUMENTS`, úsalo como contexto para ajustar el tono, enfoque o secciones del README.
- Si el proyecto aún está en su estado inicial de esqueleto sin código de producto, refleja eso honestamente.
- Sobrescribe el `README.md` existente con el nuevo contenido.
- No incluyas contenido de marcador de posición o ejemplo que no refleje el estado real del proyecto.

Flow:
1. Inspecciona la estructura del proyecto, archivos de paquete, código fuente y archivos de configuración.
2. Identifica el stack tecnológico, el propósito y las características principales.
3. Construye el README siguiendo las reglas anteriores.
4. Sobrescribe `README.md`.
5. Confirma que el archivo fue escrito.
