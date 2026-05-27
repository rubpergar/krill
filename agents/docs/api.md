# API Contracts

Not applicable — this project does not expose a public REST API. The application is a server-rendered web panel with no client-facing API endpoints.

## Routes

| Method | Path | Description |
|---|---|---|
| GET | `/` | Dashboard with metrics (total products, active products, categories, low stock) |
| GET | `/products` | Product list page (ordered by name). Accepts `?q=` (search name/SKU), `?category=` (filter by category ID), and `?success=created|updated|toggled` for flash messages |
| GET | `/products/new` | Product creation form with category dropdown |
| POST | `/products` | Create product. Redirects to `/products?success=created`. Returns 200 with form + error on validation failure |
| GET | `/products/:id/edit` | Product edit form. Returns 404 if `:id` does not exist |
| POST | `/products/:id` | Update product fields. Redirects to `/products?success=updated`. Returns 404 if `:id` does not exist |
| POST | `/products/:id/toggle` | Toggle product active/inactive. Redirects to `/products?success=toggled`. Returns 404 if `:id` does not exist |
| GET | `/categories` | Category list page (ordered alphabetically by name). Accepts `?success=created|updated|toggled` for flash messages |
| GET | `/categories/new` | Category creation form |
| POST | `/categories` | Create category. Redirects to `/categories?success=created`. Returns 200 with form + error on validation failure |
| GET | `/categories/:id/edit` | Category edit form. Returns 404 if `:id` does not exist |
| POST | `/categories/:id` | Update category name. Redirects to `/categories?success=updated`. Returns 404 if `:id` does not exist |
| POST | `/categories/:id/toggle` | Toggle category active/inactive. Redirects to `/categories?success=toggled`. Returns 404 if `:id` does not exist |

## Notes
- All routes return HTML via server-rendered EJS templates.
- Unknown routes return a 404 HTML page.
- Static assets are served under `/static/`.
