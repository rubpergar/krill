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
  conn.exec(`INSERT INTO categories (name) VALUES ('Electrónicos'), ('Ropa')`);
  const mod = await import("../app");
  app = mod.createApp();
});

afterAll(() => {
  delete process.env.DATABASE_URL;
});

describe("products CRUD", () => {
  it("GET /products returns 200 with empty table", async () => {
    const res = await app.request("/products");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Productos");
    expect(text).toContain("No hay productos");
  });

  it("GET /products with ?q= filters by name", async () => {
    await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Televisor", sku: "TV-001",
        category_id: "1", stock: "10", min_stock: "2",
      }).toString(),
    });
    const res = await app.request("/products?q=Tele");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Televisor");
  });

  it("GET /products with ?q= filters by SKU", async () => {
    const res = await app.request("/products?q=TV-001");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Televisor");
  });

  it("GET /products with ?category= filters by category", async () => {
    const res = await app.request("/products?category=1");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Televisor");
  });

  it("GET /products/new returns 200 with form and category dropdown", async () => {
    const res = await app.request("/products/new");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Nuevo Producto");
    expect(text).toContain("form");
    expect(text).toContain("Electrónicos");
    expect(text).toContain("Ropa");
  });

  it("POST /products with valid data creates product and redirects", async () => {
    const res = await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Laptop", sku: "LPT-001",
        description: "Laptop gamer", category_id: "1",
        stock: "5", min_stock: "1",
      }).toString(),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/products?success=created");
  });

  it("POST /products with empty name shows validation error", async () => {
    const res = await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "", sku: "LPT-002",
      }).toString(),
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Nuevo Producto");
    expect(text).toContain("El nombre es obligatorio");
  });

  it("POST /products with empty SKU shows validation error", async () => {
    const res = await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Tablet", sku: "",
      }).toString(),
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Nuevo Producto");
    expect(text).toContain("El SKU es obligatorio");
  });

  it("POST /products with duplicate SKU shows validation error", async () => {
    const res = await app.request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Otra Laptop", sku: "LPT-001",
      }).toString(),
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Ya existe un producto con ese SKU");
  });

  it("GET /products/:id/edit returns 200 with prefilled form", async () => {
    const res = await app.request("/products/1/edit");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Editar Producto");
    expect(text).toContain("Televisor");
    expect(text).toContain("TV-001");
  });

  it("GET /products/:id/edit with invalid id returns 404", async () => {
    const res = await app.request("/products/999/edit");
    expect(res.status).toBe(404);
  });

  it("POST /products/:id updates fields and redirects", async () => {
    const res = await app.request("/products/1", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name: "Televisor 4K", sku: "TV-001",
        category_id: "1", stock: "8", min_stock: "2",
      }).toString(),
    });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/products?success=updated");
  });

  it("POST /products/:id/toggle flips active status", async () => {
    const res = await app.request("/products/1/toggle", { method: "POST" });
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/products?success=toggled");
  });

  it("POST /products/:id/toggle with invalid id returns 404", async () => {
    const res = await app.request("/products/999/toggle", { method: "POST" });
    expect(res.status).toBe(404);
  });
});
