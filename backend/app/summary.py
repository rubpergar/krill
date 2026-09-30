from calendar import monthrange
from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Transaction, TransactionType
from app.schemas import MonthlySummary

router = APIRouter(prefix="/api/summary", tags=["summary"])


@router.get("/monthly", response_model=MonthlySummary)
def monthly_summary(
    year: int = Query(ge=1, le=9999),
    month: int = Query(ge=1, le=12),
    db: Session = Depends(get_db),
) -> MonthlySummary:
    start = date(year, month, 1)
    end = date(year, month, monthrange(year, month)[1])
    totals = db.execute(
        select(
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == TransactionType.INCOME, Transaction.amount_cents),
                        else_=0,
                    )
                ),
                0,
            ).label("income_cents"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == TransactionType.EXPENSE, Transaction.amount_cents),
                        else_=0,
                    )
                ),
                0,
            ).label("expense_cents"),
        ).where(Transaction.transaction_date.between(start, end))
    ).one()

    income_cents = int(totals.income_cents)
    expense_cents = int(totals.expense_cents)
    return MonthlySummary(
        year=year,
        month=month,
        income_cents=income_cents,
        expense_cents=expense_cents,
        balance_cents=income_cents - expense_cents,
    )
