import { describe, it, expect } from "vitest";

describe("database schema", () => {
  it("exports categories table with expected columns", async () => {
    const { categories } = await import("./schema");
    expect(categories).toBeDefined();
    expect(categories.id).toBeDefined();
    expect(categories.name).toBeDefined();
    expect(categories.active).toBeDefined();
    expect(categories.createdAt).toBeDefined();
    expect(categories.updatedAt).toBeDefined();
  });

  it("exports products table with expected columns", async () => {
    const { products } = await import("./schema");
    expect(products).toBeDefined();
    expect(products.id).toBeDefined();
    expect(products.name).toBeDefined();
    expect(products.sku).toBeDefined();
    expect(products.description).toBeDefined();
    expect(products.categoryId).toBeDefined();
    expect(products.stock).toBeDefined();
    expect(products.minStock).toBeDefined();
    expect(products.active).toBeDefined();
    expect(products.createdAt).toBeDefined();
    expect(products.updatedAt).toBeDefined();
  });
});
