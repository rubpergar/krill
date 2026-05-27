# Domain Model

## Entities

| Entity | Meaning | Notes |
|---|---|---|
| Category | Classification group for products | Can be active/inactive. Products can optionally belong to one category. |
| Product | Individual item tracked in inventory | Has SKU as unique identifier. Can be active/inactive. |

## Relationships

- A Product **belongs to** zero or one Category (optional FK `category_id`)
- A Category **has** zero or many Products
- When a Category is deleted, its Products keep the product but lose the category association (`ON DELETE SET NULL`)

## Business Rules

- **SKU uniqueness**: Each product must have a unique SKU (internal code).
- **Low stock indicator**: A product shows as "low stock" when `stock < min_stock`.
- **Active state**: Both products and categories can be active or inactive. Inactive items should be filterable but not deleted.
- **Default values**: stock defaults to 0, min_stock defaults to 0.

## Glossary

| Term | Meaning |
|---|---|
| SKU | Stock Keeping Unit — unique internal code for each product |
| Stock | Current quantity available of a product |
| Min stock | Threshold below which stock is considered low |
| Active | Boolean state indicating whether the entity is currently in use |
