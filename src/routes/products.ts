import { Hono } from "hono";
import { render } from "../lib/render";

export const productRoutes = new Hono().get("/", async (c) => {
  const html = await render("products/index", {
    title: "Productos",
    currentPath: "/products",
  });
  return c.html(html);
});
