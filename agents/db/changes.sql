-- Registro de cambios de BD de respaldo para proyectos nuevos o no configurados.
--
-- Si `AGENTS.md` apunta a un archivo de registro de cambios de BD local del proyecto, actualiza ese archivo en lugar de este.
--
-- Formato de entrada de ejemplo:
[TASK-XXX] Short title
Date: YYYY-MM-DD
Forward:
CREATE TABLE example (id INT PRIMARY KEY);
Rollback:
DROP TABLE IF EXISTS example;
