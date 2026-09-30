# myFinancePal

Aplicación web local para registrar ingresos y gastos y consultar un resumen mensual.

## Stack

- Backend: Python 3.12, FastAPI, SQLAlchemy, Alembic y SQLite.
- Frontend: Node 22 LTS, React, Vite, Tailwind CSS y Recharts.
- Testing: pytest, Vitest, React Testing Library y Playwright.
- Calidad: Ruff, mypy, ESLint y Prettier.

## Desarrollo

```bash
uv sync --project backend
pnpm install
```

Backend:

```bash
uv run --project backend --directory backend uvicorn app.main:app --reload
```

Frontend:

```bash
pnpm --dir frontend dev
```

## Validación

```bash
uv run --project backend --directory backend pytest
uv run --project backend --directory backend ruff check .
uv run --project backend --directory backend mypy app
pnpm --dir frontend test
pnpm --dir frontend lint
pnpm --dir frontend build
pnpm --dir frontend format:check
```

La aplicación todavía está en la fase de inicialización técnica; las funcionalidades de ingresos, gastos y resumen se implementarán mediante tareas SDD independientes.
