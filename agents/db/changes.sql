-- Database Change Log: PrawnForms
-- Format: ordered SQL changes with rollback notes

-- 2026-05-21: TASK-002 — Create domain tables
-- Forward:
CREATE TABLE "leads" (...);
CREATE TABLE "notas_internas" (...);
CREATE TABLE "eventos_auditoria" (...);
ALTER TABLE "users" ADD COLUMN "rol" varchar NOT NULL DEFAULT 'usuario';
ALTER TABLE "users" ADD COLUMN "activo" boolean NOT NULL DEFAULT true;

-- Rollback:
-- DROP TABLE eventos_auditoria;
-- DROP TABLE notas_internas;
-- DROP TABLE leads;
-- ALTER TABLE users DROP COLUMN rol;
-- ALTER TABLE users DROP COLUMN activo;
