# API Contracts

Mark as `Not applicable` if the project exposes no public API.

Document only contracts that clients depend on and that the code does not already express. If the project generates an OpenAPI spec or a typed client, reference it instead of copying route tables; keep this file for conventions and compatibility that code cannot express.

## Conventions
- Base URL: `http://localhost:8000`
- Auth: None; single local user
- Error format: FastAPI validation errors for invalid requests and JSON error responses for application errors
- Pagination: None in the MVP; return the complete local movement list
- Versioning/compatibility: No version prefix; preserve existing JSON fields once published

## Contracts not visible in code
Transactions use `type` values `income` or `expense`, positive `amount_cents`, an ISO date in `transaction_date`, and an optional `description` up to 500 characters. The monthly balance is income minus expenses.

## API Schema
- FastAPI publishes the complete route, payload, response, and validation schema at `/openapi.json`.
- The interactive documentation is available at `/docs` during local development.

## Compatibility Notes
- ...
