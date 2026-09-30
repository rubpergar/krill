from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Transaction
from app.schemas import TransactionList, TransactionPayload, TransactionResponse

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


def get_transaction_or_404(db: Session, transaction_id: int) -> Transaction:
    transaction = db.get(Transaction, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionPayload, db: Session = Depends(get_db)) -> Transaction:
    transaction = Transaction(**payload.model_dump())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.get("", response_model=TransactionList)
def list_transactions(db: Session = Depends(get_db)) -> TransactionList:
    transactions = db.scalars(
        select(Transaction).order_by(
            Transaction.transaction_date.desc(),
            Transaction.created_at.desc(),
            Transaction.id.desc(),
        )
    ).all()
    return TransactionList(
        items=[TransactionResponse.model_validate(transaction) for transaction in transactions]
    )


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    payload: TransactionPayload,
    db: Session = Depends(get_db),
) -> Transaction:
    transaction = get_transaction_or_404(db, transaction_id)

    for field, value in payload.model_dump().items():
        setattr(transaction, field, value)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)) -> None:
    transaction = get_transaction_or_404(db, transaction_id)

    db.delete(transaction)
    db.commit()
