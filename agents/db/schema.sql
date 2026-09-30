-- Current fallback schema for the local SQLite database.
--
-- Keep this file synchronized with the Alembic migrations and the domain model.
--

CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    transaction_date DATE NOT NULL,
    description TEXT CHECK (description IS NULL OR length(description) <= 500),
    seed_key TEXT UNIQUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
