"""add stable seed identity

Revision ID: 20260930_0002
Revises: 20260930_0001
Create Date: 2026-09-30
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "20260930_0002"
down_revision: str | None = "20260930_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("transactions", sa.Column("seed_key", sa.String(length=100), nullable=True))
    op.create_index("ix_transactions_seed_key", "transactions", ["seed_key"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_transactions_seed_key", table_name="transactions")
    op.drop_column("transactions", "seed_key")
