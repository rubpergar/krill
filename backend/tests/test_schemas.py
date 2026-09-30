from datetime import date

import pytest
from pydantic import ValidationError

from app.models import TransactionType
from app.schemas import TransactionPayload


def test_transaction_payload_accepts_valid_values() -> None:
    payload = TransactionPayload(
        type=TransactionType.INCOME,
        amount_cents=1250,
        transaction_date=date(2026, 9, 30),
        description="Nómina",
    )

    assert payload.model_dump() == {
        "type": TransactionType.INCOME,
        "amount_cents": 1250,
        "transaction_date": date(2026, 9, 30),
        "description": "Nómina",
    }


@pytest.mark.parametrize(
    "payload",
    (
        {"type": "transfer", "amount_cents": 100, "transaction_date": "2026-09-30"},
        {"type": "income", "amount_cents": 0, "transaction_date": "2026-09-30"},
        {"type": "income", "amount_cents": 100, "transaction_date": "not-a-date"},
        {"type": "income", "amount_cents": 100, "description": "x" * 501},
    ),
)
def test_transaction_payload_rejects_invalid_values(payload: dict[str, object]) -> None:
    with pytest.raises(ValidationError):
        TransactionPayload.model_validate(payload)
