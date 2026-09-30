from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.models import TransactionType


class TransactionPayload(BaseModel):
    type: TransactionType
    amount_cents: int = Field(gt=0)
    transaction_date: date
    description: str | None = Field(default=None, max_length=500)


class TransactionResponse(TransactionPayload):
    model_config = ConfigDict(from_attributes=True)

    id: int


class TransactionList(BaseModel):
    items: list[TransactionResponse]


class MonthlySummary(BaseModel):
    year: int
    month: int
    income_cents: int
    expense_cents: int
    balance_cents: int
