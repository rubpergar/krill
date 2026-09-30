# Domain Model

Mark as `Not applicable` if the project has no persistent domain model.

## Entities
| Entity | Meaning | Notes |
|---|---|---|
| Transaction | An income or expense movement | `type` is `income` or `expense`; amount is stored as integer cents |

## Relationships
- A transaction has one type and one positive amount.
- Dates are required and future dates are allowed.
- Descriptions are optional and limited to 500 characters.
- The MVP uses EUR for all movements.
- Deletion is physical and requires UI confirmation.

## Business Rules
- A transaction type must be `income` or `expense`.
- Amounts are positive integer cents and use EUR in the MVP.
- Monthly balance equals total income minus total expenses.
- Seed data is idempotent and must not be duplicated by repeated runs.
- Seed examples use an internal stable key that is not exposed by the API.

## Glossary
| Term | Meaning |
|---|---|
| Income | Money received by the user |
| Expense | Money spent by the user |
| Balance | Monthly income minus monthly expenses |
