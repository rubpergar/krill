import { Hono } from "hono";
import { render } from "../lib/render";

export const dashboardRoutes = new Hono().get("/", async (c) => {
  const metrics = {
    totalProducts: 42,
    activeProducts: 38,
    categories: 8,
    lowStock: 3,
  };
  const html = await render("dashboard", {
    title: "Dashboard",
    metrics,
    currentPath: "/",
  });
  return c.html(html);
});
