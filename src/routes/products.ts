import { Hono } from "hono";
import { eq, like, and, or, lte } from "drizzle-orm";
import { db } from "../db/index";
import { products, categories } from "../db/schema";
import { render } from "../lib/render";

export const productRoutes = new Hono()
  .get("/", async (c) => {
    const q = c.req.query("q");
    const categoryFilter = c.req.query("category");
    const lowStock = c.req.query("low_stock");
    const success = c.req.query("success");
    const catId = categoryFilter ? parseInt(categoryFilter, 10) : NaN;

    const query = db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        stock: products.stock,
        minStock: products.minStock,
        active: products.active,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    const conditions = [];
    if (q) {
      conditions.push(
        or(
          like(products.name, `%${q}%`),
          like(products.sku, `%${q}%`),
        ),
      );
    }
    if (!isNaN(catId)) {
      conditions.push(eq(products.categoryId, catId));
    }
    if (lowStock === "1") {
      conditions.push(lte(products.stock, products.minStock));
    }

    const allProducts =
      conditions.length > 0
        ? await query.where(and(...conditions)).orderBy(products.name)
        : await query.orderBy(products.name);

    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.active, 1))
      .orderBy(categories.name);

    const html = await render("products/index", {
      title: "Productos",
      currentPath: "/products",
      products: allProducts,
      categories: allCategories,
      q: q || "",
      categoryFilter: categoryFilter || "",
      lowStock: lowStock === "1",
      success,
    });
    return c.html(html);
  })
  .get("/new", async (c) => {
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.active, 1))
      .orderBy(categories.name);
    const html = await render("products/form", {
      title: "Nuevo Producto",
      currentPath: "/products",
      product: null,
      categories: allCategories,
      formData: {},
      error: null,
    });
    return c.html(html);
  })
  .post("/", async (c) => {
    const body = await c.req.parseBody();
    const name = ((body.name as string) || "").trim();
    const sku = ((body.sku as string) || "").trim();
    const description = (body.description as string) || "";
    const categoryId = body.category_id
      ? parseInt(body.category_id as string, 10)
      : null;
    const stock = parseInt((body.stock as string) || "0", 10);
    const minStock = parseInt((body.min_stock as string) || "0", 10);
    const formData = { name, sku, description, category_id: categoryId, stock, min_stock: minStock };

    if (!name) {
      const allCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.active, 1))
        .orderBy(categories.name);
      const html = await render("products/form", {
        title: "Nuevo Producto",
        currentPath: "/products",
        product: null,
        categories: allCategories,
        formData,
        error: "El nombre es obligatorio",
      });
      return c.html(html);
    }

    if (!sku) {
      const allCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.active, 1))
        .orderBy(categories.name);
      const html = await render("products/form", {
        title: "Nuevo Producto",
        currentPath: "/products",
        product: null,
        categories: allCategories,
        formData,
        error: "El SKU es obligatorio",
      });
      return c.html(html);
    }

    try {
      await db.insert(products).values({
        name,
        sku,
        description: description || null,
        categoryId,
        stock,
        minStock,
      });
      return c.redirect("/products?success=created");
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (
        err?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
        (err?.message && err.message.includes("UNIQUE"))
      ) {
        const allCategories = await db
          .select()
          .from(categories)
          .where(eq(categories.active, 1))
          .orderBy(categories.name);
        const html = await render("products/form", {
          title: "Nuevo Producto",
          currentPath: "/products",
          product: null,
          categories: allCategories,
          formData,
          error: "Ya existe un producto con ese SKU",
        });
        return c.html(html);
      }
      throw e;
    }
  })
  .get("/:id/stock", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!product) {
      return c.notFound();
    }
    const html = await render("products/stock", {
      title: "Ajustar Stock",
      currentPath: "/products",
      product,
      error: null,
    });
    return c.html(html);
  })
  .post("/:id/stock", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!product) {
      return c.notFound();
    }

    const body = await c.req.parseBody();
    const operation = body.operation as string;
    const quantity = parseInt((body.quantity as string) || "0", 10);

    if (quantity <= 0) {
      const html = await render("products/stock", {
        title: "Ajustar Stock",
        currentPath: "/products",
        product,
        error: "La cantidad debe ser mayor a cero",
      });
      return c.html(html);
    }

    if (operation === "remove" && product.stock < quantity) {
      const html = await render("products/stock", {
        title: "Ajustar Stock",
        currentPath: "/products",
        product,
        error: `Stock insuficiente. Stock actual: ${product.stock}`,
      });
      return c.html(html);
    }

    const newStock =
      operation === "remove"
        ? product.stock - quantity
        : product.stock + quantity;

    await db
      .update(products)
      .set({ stock: newStock })
      .where(eq(products.id, id));

    return c.redirect("/products?success=stock_updated");
  })
  .get("/:id/edit", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!product) {
      return c.notFound();
    }
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.active, 1))
      .orderBy(categories.name);
    const html = await render("products/form", {
      title: "Editar Producto",
      currentPath: "/products",
      product,
      categories: allCategories,
      formData: {
        name: product.name,
        sku: product.sku,
        description: product.description || "",
        category_id: product.categoryId,
        stock: product.stock,
        min_stock: product.minStock,
      },
      error: null,
    });
    return c.html(html);
  })
  .post("/:id", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!existing) {
      return c.notFound();
    }

    const body = await c.req.parseBody();
    const name = ((body.name as string) || "").trim();
    const sku = ((body.sku as string) || "").trim();
    const description = (body.description as string) || "";
    const categoryId = body.category_id
      ? parseInt(body.category_id as string, 10)
      : null;
    const stock = parseInt((body.stock as string) || "0", 10);
    const minStock = parseInt((body.min_stock as string) || "0", 10);
    const formData = { name, sku, description, category_id: categoryId, stock, min_stock: minStock };

    if (!name) {
      const allCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.active, 1))
        .orderBy(categories.name);
      const html = await render("products/form", {
        title: "Editar Producto",
        currentPath: "/products",
        product: existing,
        categories: allCategories,
        formData,
        error: "El nombre es obligatorio",
      });
      return c.html(html);
    }

    if (!sku) {
      const allCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.active, 1))
        .orderBy(categories.name);
      const html = await render("products/form", {
        title: "Editar Producto",
        currentPath: "/products",
        product: existing,
        categories: allCategories,
        formData,
        error: "El SKU es obligatorio",
      });
      return c.html(html);
    }

    try {
      await db
        .update(products)
        .set({ name, sku, description: description || null, categoryId, stock, minStock })
        .where(eq(products.id, id));
      return c.redirect("/products?success=updated");
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (
        err?.code === "SQLITE_CONSTRAINT_UNIQUE" ||
        (err?.message && err.message.includes("UNIQUE"))
      ) {
        const allCategories = await db
          .select()
          .from(categories)
          .where(eq(categories.active, 1))
          .orderBy(categories.name);
        const html = await render("products/form", {
          title: "Editar Producto",
          currentPath: "/products",
          product: existing,
          categories: allCategories,
          formData,
          error: "Ya existe un producto con ese SKU",
        });
        return c.html(html);
      }
      throw e;
    }
  })
  .post("/:id/toggle", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    if (!product) {
      return c.notFound();
    }
    await db
      .update(products)
      .set({ active: product.active ? 0 : 1 })
      .where(eq(products.id, id));
    return c.redirect("/products?success=toggled");
  });
