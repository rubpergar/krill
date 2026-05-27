import { describe, it, expect, beforeAll } from "vitest";
import type { Hono } from "hono";

let app: Hono;

beforeAll(async () => {
  const mod = await import("../app");
  app = mod.createApp();
});

describe("panel routes", () => {
  it("GET / returns 200 with dashboard HTML", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Dashboard");
  });

  it("GET /products returns 200 with products page", async () => {
    const res = await app.request("/products");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Productos");
  });

  it("GET /categories returns 200 with categories page", async () => {
    const res = await app.request("/categories");
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Categorías");
  });

  it("GET /nonexistent returns 404", async () => {
    const res = await app.request("/nonexistent");
    expect(res.status).toBe(404);
  });

  it("navigation includes links to main sections", async () => {
    const res = await app.request("/");
    const text = await res.text();
    expect(text).toContain('href="/"');
    expect(text).toContain('href="/products"');
    expect(text).toContain('href="/categories"');
  });

  it("dashboard shows metric cards", async () => {
    const res = await app.request("/");
    const text = await res.text();
    expect(text).toContain("Total Productos");
    expect(text).toContain("Productos Activos");
    expect(text).toContain("Categorías");
    expect(text).toContain("Stock Bajo");
  });
});
