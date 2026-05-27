import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { Hono } from "hono";

let app: Hono;

beforeAll(async () => {
  process.env.DATABASE_URL = ":memory:";
  const { sqlite: conn } = await import("../db/index");
  conn.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL UNIQUE,
      active INTEGER DEFAULT 1 NOT NULL,
      created_at TEXT DEFAULT "datetime('now')" NOT NULL,
      updated_at TEXT DEFAULT "datetime('now')" NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS categories_name_unique ON categories (name);
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      description TEXT,
      category_id INTEGER,
      stock INTEGER DEFAULT 0 NOT NULL,
      min_stock INTEGER DEFAULT 0 NOT NULL,
      active INTEGER DEFAULT 1 NOT NULL,
      created_at TEXT DEFAULT "datetime('now')" NOT NULL,
      updated_at TEXT DEFAULT "datetime('now')" NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS products_sku_unique ON products (sku);
  `);
  const mod = await import("../app");
  app = mod.createApp();
});

afterAll(() => {
  delete process.env.DATABASE_URL;
});

describe("dashboard metrics from database", () => {
  it("GET / shows 0 for all metrics with empty database", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Total Productos");
    expect(text).toContain("Productos Activos");
    expect(text).toContain("Categorías");
    expect(text).toContain("Stock Bajo");
    expect(text).toContain(">0</p>");
  });

  it("GET / shows correct metrics with populated database", async () => {
    await app.request("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ name: "Electrónicos" }).toString(),
    });
    await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Laptop", sku: "LPT-001",
        category_id: "1", stock: "10", min_stock: "2",
      }).toString(),
    });
    await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Mouse", sku: "MOU-001",
        category_id: "1", stock: "1", min_stock: "5",
      }).toString(),
    });
    await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Teclado", sku: "TEC-001",
        category_id: "1", stock: "3", min_stock: "3",
      }).toString(),
    });

    const res = await app.request("/");
    expect(res.status).toBe(200);
    const text = await res.text();

    expect(text).not.toContain(">42</p>");
    expect(text).not.toContain(">38</p>");
    expect(text).not.toContain(">8</p>");
    expect(text).toContain(">3</p>");
    expect(text).toContain(">1</p>");
  });
});
