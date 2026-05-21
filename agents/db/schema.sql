-- PrawnForms Database Schema (SQLite for development, PostgreSQL for production)
-- Generated from Laravel migrations

-- Users (extends Laravel default with rol and activo)
CREATE TABLE "users" (
    "id" integer primary key autoincrement not null,
    "name" varchar not null,
    "email" varchar not null,
    "email_verified_at" datetime,
    "password" varchar not null,
    "remember_token" varchar,
    "created_at" datetime,
    "updated_at" datetime,
    "rol" varchar not null default 'usuario',
    "activo" boolean not null default true
);
CREATE UNIQUE INDEX "users_email_unique" on "users" ("email");

-- Leads (solicitudes de captación)
CREATE TABLE "leads" (
    "id" integer primary key autoincrement not null,
    "nombre" varchar not null,
    "email" varchar not null,
    "telefono" varchar,
    "empresa" varchar,
    "tipo_necesidad" varchar not null,
    "mensaje" text not null,
    "estado" varchar not null default 'Nuevo',
    "responsable_id" integer references "users"("id") on delete set null,
    "origen" varchar,
    "ip_origen" varchar,
    "user_agent" text,
    "consentimiento_aceptado" boolean not null default false,
    "consentimiento_fecha" datetime,
    "archivado" boolean not null default false,
    "created_at" datetime,
    "updated_at" datetime
);

-- Notas internas de seguimiento
CREATE TABLE "notas_internas" (
    "id" integer primary key autoincrement not null,
    "lead_id" integer not null references "leads"("id") on delete cascade,
    "usuario_id" integer not null references "users"("id") on delete cascade,
    "contenido" text not null,
    "created_at" datetime,
    "updated_at" datetime
);

-- Eventos de auditoría
CREATE TABLE "eventos_auditoria" (
    "id" integer primary key autoincrement not null,
    "lead_id" integer not null references "leads"("id") on delete cascade,
    "usuario_id" integer references "users"("id") on delete set null,
    "accion" varchar not null,
    "campo" varchar,
    "valor_anterior" text,
    "valor_nuevo" text,
    "created_at" datetime,
    "updated_at" datetime
);

-- Laravel framework tables (cache, jobs, sessions, etc.)
-- Not included here as they are standard Laravel tables
