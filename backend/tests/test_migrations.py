from pathlib import Path

import pytest
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import IntegrityError

from alembic import command


@pytest.fixture
def migrated_engine(tmp_path: Path):
    database_path = tmp_path / "migration_test"
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", f"sqlite:///{database_path}")

    command.upgrade(config, "head")

    engine = create_engine(f"sqlite:///{database_path}")
    try:
        yield engine
    finally:
        command.downgrade(config, "base")
        engine.dispose()


def test_initial_migration_creates_transactions_table(migrated_engine) -> None:
    assert "transactions" in inspect(migrated_engine).get_table_names()


def test_initial_migration_defines_transaction_columns(migrated_engine) -> None:
    columns = {
        column["name"]: column for column in inspect(migrated_engine).get_columns("transactions")
    }

    assert set(columns) == {
        "id",
        "type",
        "amount_cents",
        "transaction_date",
        "description",
        "seed_key",
        "created_at",
        "updated_at",
    }
    assert columns["id"]["primary_key"] == 1
    assert columns["id"]["nullable"] is False
    assert columns["type"]["nullable"] is False
    assert columns["amount_cents"]["nullable"] is False
    assert columns["transaction_date"]["nullable"] is False
    assert columns["description"]["nullable"] is True
    assert columns["seed_key"]["nullable"] is True
    assert columns["created_at"]["nullable"] is False
    assert columns["updated_at"]["nullable"] is False


@pytest.mark.parametrize(
    ("column", "value"),
    (
        ("type", "transfer"),
        ("amount_cents", 0),
        ("amount_cents", -1),
        ("description", "x" * 501),
    ),
)
def test_initial_migration_rejects_invalid_values(migrated_engine, column: str, value) -> None:
    values = {
        "type": "income",
        "amount_cents": 100,
        "transaction_date": "2026-09-30",
        "description": None,
        "created_at": "2026-09-30 00:00:00",
        "updated_at": "2026-09-30 00:00:00",
    }
    values[column] = value

    with pytest.raises(IntegrityError):
        with migrated_engine.begin() as connection:
            connection.execute(
                text(
                    """
                    INSERT INTO transactions
                        (type, amount_cents, transaction_date, description, created_at, updated_at)
                    VALUES
                        (:type, :amount_cents, :transaction_date, :description,
                         :created_at, :updated_at)
                    """
                ),
                values,
            )


def test_initial_migration_downgrades_transactions_table(tmp_path: Path) -> None:
    database_path = tmp_path / "migration_rollback_test"
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", f"sqlite:///{database_path}")

    command.upgrade(config, "head")
    engine = create_engine(f"sqlite:///{database_path}")
    try:
        assert "transactions" in inspect(engine).get_table_names()
        command.downgrade(config, "base")
        assert "transactions" not in inspect(engine).get_table_names()
    finally:
        engine.dispose()
