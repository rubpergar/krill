import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Hono } from "hono";

let app: Hono;

beforeAll(async () => {
  process.env.DATABASE_URL = ":memory:";
  const { sqlite } = await import("../db/index");
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL UNIQUE,
      active INTEGER DEFAULT 1 NOT NULL,
      created_at TEXT DEFAULT "datetime('now')" NOT NULL,
      updated_at TEXT DEFAULT "datetime('now')" NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS categories_name_unique ON categories (name);
  `);
  const mod = await import("../app");
  app = mod.createApp();
});

afterAll(() => {
  delete process.env.DATABASE_URL;
});

describe("categories CRUD", () => {
  it("GET /categories returns 200 with empty table message", async () => {
    const res = await app.request("/categories");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Categorías");
    expect(text).toContain("No hay categorías");
  });

  it("GET /categories/new returns 200 with creation form", async () => {
    const res = await app.request("/categories/new");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Nueva Categoría");
    expect(text).toContain("form");
    expect(text).toContain("method=\"POST\"");
  });

  it("POST /categories with valid data creates category and redirects", async () => {
    const res = await app.request("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: "Electrónicos" }).toString(),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/categories?success=created");
  });

  it("POST /categories with empty name shows validation error", async () => {
    const res = await app.request("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: "" }).toString(),
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Nueva Categoría");
    expect(text).toContain("El nombre es obligatorio");
  });

  it("POST /categories with duplicate name shows validation error", async () => {
    const res = await app.request("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: "Electrónicos" }).toString(),
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Ya existe una categoría con ese nombre");
  });

  it("GET /categories/:id/edit returns 200 with form prefilled", async () => {
    const res = await app.request("/categories/1/edit");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Editar Categoría");
    expect(text).toContain("Electrónicos");
  });

  it("GET /categories/:id/edit with invalid id returns 404", async () => {
    const res = await app.request("/categories/999/edit");
    expect(res.status).toBe(404);
  });

  it("POST /categories/:id updates name and redirects", async () => {
    const res = await app.request("/categories/1", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: "Electrodomésticos" }).toString(),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/categories?success=updated");
  });

  it("POST /categories/:id/toggle flips active status and redirects", async () => {
    const res = await app.request("/categories/1/toggle", { method: "POST" });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/categories?success=toggled");
  });

  it("POST /categories/:id/toggle with invalid id returns 404", async () => {
    const res = await app.request("/categories/999/toggle", { method: "POST" });
    expect(res.status).toBe(404);
  });
});
