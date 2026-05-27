import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { categories } from "../db/schema";
import { render } from "../lib/render";

export const categoryRoutes = new Hono()
  .get("/", async (c) => {
    const success = c.req.query("success");
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.name);
    const html = await render("categories/index", {
      title: "Categorías",
      currentPath: "/categories",
      categories: allCategories,
      success,
    });
    return c.html(html);
  })
  .get("/new", async (c) => {
    const html = await render("categories/form", {
      title: "Nueva Categoría",
      currentPath: "/categories",
      category: null,
      name: "",
      error: null,
    });
    return c.html(html);
  })
  .post("/", async (c) => {
    const body = await c.req.parseBody();
    const name = ((body.name as string) || "").trim();
    if (!name) {
      const html = await render("categories/form", {
        title: "Nueva Categoría",
        currentPath: "/categories",
        category: null,
        name: "",
        error: "El nombre es obligatorio",
      });
      return c.html(html);
    }
    try {
      await db.insert(categories).values({ name });
      return c.redirect("/categories?success=created");
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (err?.code === "SQLITE_CONSTRAINT_UNIQUE" || (err?.message && err.message.includes("UNIQUE"))) {
        const html = await render("categories/form", {
          title: "Nueva Categoría",
          currentPath: "/categories",
          category: null,
          name,
          error: "Ya existe una categoría con ese nombre",
        });
        return c.html(html);
      }
      throw e;
    }
  })
  .get("/:id/edit", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    if (!category) {
      return c.notFound();
    }
    const html = await render("categories/form", {
      title: "Editar Categoría",
      currentPath: "/categories",
      category,
      name: category.name,
      error: null,
    });
    return c.html(html);
  })
  .post("/:id", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const body = await c.req.parseBody();
    const name = ((body.name as string) || "").trim();
    const [existing] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    if (!existing) {
      return c.notFound();
    }
    if (!name) {
      const html = await render("categories/form", {
        title: "Editar Categoría",
        currentPath: "/categories",
        category: existing,
        name: "",
        error: "El nombre es obligatorio",
      });
      return c.html(html);
    }
    try {
      await db.update(categories).set({ name }).where(eq(categories.id, id));
      return c.redirect("/categories?success=updated");
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      if (err?.code === "SQLITE_CONSTRAINT_UNIQUE" || (err?.message && err.message.includes("UNIQUE"))) {
        const html = await render("categories/form", {
          title: "Editar Categoría",
          currentPath: "/categories",
          category: { ...existing, name },
          name,
          error: "Ya existe una categoría con ese nombre",
        });
        return c.html(html);
      }
      throw e;
    }
  })
  .post("/:id/toggle", async (c) => {
    const id = parseInt(c.req.param("id"), 10);
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    if (!category) {
      return c.notFound();
    }
    await db
      .update(categories)
      .set({ active: category.active ? 0 : 1 })
      .where(eq(categories.id, id));
    return c.redirect("/categories?success=toggled");
  });
