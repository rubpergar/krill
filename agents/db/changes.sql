-- DB change log fallback for new or unconfigured projects.
--
-- If `AGENTS.md` points to a project-local DB change log file, update that file instead of this one.
--
-- Example entry format:
[TASK-XXX] Short title
Date: YYYY-MM-DD
Forward:
CREATE TABLE example (id INT PRIMARY KEY);
Rollback:
DROP TABLE IF EXISTS example;
