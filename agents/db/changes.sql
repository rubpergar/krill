-- Ordered DB change log for the local SQLite database.
--
-- Keep this file synchronized with the Alembic migrations.
--
-- Example entry format:
Task: Short title
Date: YYYY-MM-DD
Forward:
CREATE TABLE example (id INT PRIMARY KEY);
Rollback:
DROP TABLE IF EXISTS example;

Task: Initialize myFinancePal transaction schema
Date: 2026-09-30
Forward:
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    transaction_date DATE NOT NULL,
    description TEXT CHECK (description IS NULL OR length(description) <= 500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);
Rollback:
DROP TABLE IF EXISTS transactions;

Task: Add stable identity for seed transactions
Date: 2026-09-30
Forward:
ALTER TABLE transactions ADD COLUMN seed_key TEXT;
CREATE UNIQUE INDEX ix_transactions_seed_key ON transactions (seed_key);
Rollback:
DROP INDEX IF EXISTS ix_transactions_seed_key;
ALTER TABLE transactions DROP COLUMN seed_key;
