import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { dashboardRoutes } from "./routes/dashboard";
import { productRoutes } from "./routes/products";
import { categoryRoutes } from "./routes/categories";
import { render } from "./lib/render";

export type AppType = Hono;

export function createApp() {
  const app = new Hono();

  app.use("/static/*", serveStatic({ root: "./" }));

  app.route("/", dashboardRoutes);
  app.route("/products", productRoutes);
  app.route("/categories", categoryRoutes);

  app.notFound(async (c) => {
    const html = await render("errors/404", { title: "404", currentPath: "" });
    return c.html(html, 404);
  });

  return app;
}
