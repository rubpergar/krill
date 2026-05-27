import { Hono } from "hono";
import { render } from "../lib/render";
import { db } from "../db";
import { products, categories } from "../db/schema";
import { count, eq, lte } from "drizzle-orm";

export const dashboardRoutes = new Hono().get("/", async (c) => {
  const [totalRes, activeRes, catRes, lowRes] = await Promise.all([
    db.select({ value: count() }).from(products),
    db.select({ value: count() }).from(products).where(eq(products.active, 1)),
    db.select({ value: count() }).from(categories),
    db.select({ value: count() }).from(products).where(lte(products.stock, products.minStock)),
  ]);
  const metrics = {
    totalProducts: totalRes[0].value,
    activeProducts: activeRes[0].value,
    categories: catRes[0].value,
    lowStock: lowRes[0].value,
  };
  const html = await render("dashboard", {
    title: "Dashboard",
    metrics,
    currentPath: "/",
  });
  return c.html(html);
});
