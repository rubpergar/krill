from datetime import date
from pathlib import Path
from typing import TypedDict

from alembic.config import Config
from sqlalchemy import select
from sqlalchemy.orm import Session

from alembic import command
from app.db import SessionLocal
from app.models import Transaction, TransactionType


class SeedTransaction(TypedDict):
    seed_key: str
    type: TransactionType
    amount_cents: int
    transaction_date: date
    description: str


SEED_TRANSACTIONS: tuple[SeedTransaction, ...] = (
    {
        "seed_key": "example-payroll",
        "type": TransactionType.INCOME,
        "amount_cents": 250000,
        "transaction_date": date(2026, 9, 1),
        "description": "Ejemplo de nómina",
    },
    {
        "seed_key": "example-coffee",
        "type": TransactionType.EXPENSE,
        "amount_cents": 1250,
        "transaction_date": date(2026, 9, 3),
        "description": "Ejemplo de café",
    },
)


def seed_database(db: Session) -> None:
    existing_seed_keys = {
        item.seed_key
        for item in db.scalars(select(Transaction)).all()
        if item.seed_key is not None
    }

    for data in SEED_TRANSACTIONS:
        if data["seed_key"] not in existing_seed_keys:
            db.add(Transaction(**data))
            existing_seed_keys.add(data["seed_key"])

    db.commit()


def main() -> None:
    config = Config(str(Path(__file__).resolve().parent.parent / "alembic.ini"))
    command.upgrade(config, "head")
    with SessionLocal() as db:
        seed_database(db)


if __name__ == "__main__":
    main()
