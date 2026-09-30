from collections.abc import Iterator
from datetime import date
from pathlib import Path

import pytest
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from alembic import command
from app import models  # noqa: F401
from app.db import get_db
from app.main import app


@pytest.fixture
def client(tmp_path: Path) -> Iterator[TestClient]:
    database_path = tmp_path / "transactions_test"
    config = Config(str(Path(__file__).parents[1] / "alembic.ini"))
    config.set_main_option("sqlalchemy.url", f"sqlite:///{database_path}")
    command.upgrade(config, "head")
    engine = create_engine(f"sqlite:///{database_path}")
    session_factory = sessionmaker(bind=engine)

    def override_get_db() -> Iterator[Session]:
        with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        command.downgrade(config, "base")
        engine.dispose()


def test_create_transaction(client: TestClient) -> None:
    response = client.post(
        "/api/transactions",
        json={
            "type": "expense",
            "amount_cents": 1250,
            "transaction_date": "2026-09-30",
            "description": "Comida",
        },
    )

    assert response.status_code == 201
    assert response.json()["amount_cents"] == 1250
    assert response.json()["transaction_date"] == date(2026, 9, 30).isoformat()


def test_list_transactions(client: TestClient) -> None:
    client.post(
        "/api/transactions",
        json={
            "type": "expense",
            "amount_cents": 1250,
            "transaction_date": "2026-09-30",
            "description": "Comida",
        },
    )
    listed = client.get("/api/transactions")

    assert listed.status_code == 200
    assert listed.json()["items"][0]["description"] == "Comida"


def test_transaction_validation_rejects_non_positive_amount(client: TestClient) -> None:
    response = client.post(
        "/api/transactions",
        json={
            "type": "income",
            "amount_cents": 0,
            "transaction_date": "2026-09-30",
        },
    )

    assert response.status_code == 422


def test_transaction_validation_rejects_long_description(client: TestClient) -> None:
    response = client.post(
        "/api/transactions",
        json={
            "type": "income",
            "amount_cents": 100,
            "transaction_date": "2026-09-30",
            "description": "x" * 501,
        },
    )

    assert response.status_code == 422


@pytest.mark.parametrize(
    "payload",
    (
        {
            "type": "transfer",
            "amount_cents": 100,
            "transaction_date": "2026-09-30",
        },
        {
            "type": "income",
            "amount_cents": -1,
            "transaction_date": "2026-09-30",
        },
        {
            "type": "income",
            "amount_cents": 100.123,
            "transaction_date": "2026-09-30",
        },
        {
            "type": "income",
            "amount_cents": "not-an-amount",
            "transaction_date": "2026-09-30",
        },
        {
            "type": "income",
            "amount_cents": 100,
            "transaction_date": "not-a-date",
        },
        {
            "type": "income",
            "amount_cents": 100,
        },
    ),
)
def test_transaction_validation_rejects_invalid_payloads(
    client: TestClient, payload: dict[str, object]
) -> None:
    response = client.post("/api/transactions", json=payload)

    assert response.status_code == 422


def test_transaction_accepts_empty_and_absent_description(client: TestClient) -> None:
    for description in (None, ""):
        payload = {
            "type": "income",
            "amount_cents": 100,
            "transaction_date": "2026-09-30",
        }
        if description is not None:
            payload["description"] = description

        response = client.post("/api/transactions", json=payload)

        assert response.status_code == 201
        assert response.json()["description"] == description


def test_transaction_accepts_future_date(client: TestClient) -> None:
    response = client.post(
        "/api/transactions",
        json={
            "type": "income",
            "amount_cents": 100,
            "transaction_date": "2099-01-01",
        },
    )

    assert response.status_code == 201
    assert response.json()["transaction_date"] == "2099-01-01"


def test_update_transaction(client: TestClient) -> None:
    created = client.post(
        "/api/transactions",
        json={
            "type": "income",
            "amount_cents": 5000,
            "transaction_date": "2026-09-30",
        },
    )
    transaction_id = created.json()["id"]

    updated = client.put(
        f"/api/transactions/{transaction_id}",
        json={
            "type": "income",
            "amount_cents": 5500,
            "transaction_date": "2026-10-01",
            "description": "Nómina",
        },
    )

    assert updated.status_code == 200
    assert updated.json()["amount_cents"] == 5500


def test_delete_transaction_removes_it(client: TestClient) -> None:
    created = client.post(
        "/api/transactions",
        json={
            "type": "income",
            "amount_cents": 5000,
            "transaction_date": "2026-09-30",
        },
    )
    transaction_id = created.json()["id"]

    deleted = client.delete(f"/api/transactions/{transaction_id}")

    assert deleted.status_code == 204
    assert client.get("/api/transactions").json()["items"] == []


def test_delete_unknown_transaction_returns_not_found(client: TestClient) -> None:
    response = client.delete("/api/transactions/999")

    assert response.status_code == 404


def test_update_unknown_transaction_returns_not_found(client: TestClient) -> None:
    response = client.put(
        "/api/transactions/999",
        json={
            "type": "income",
            "amount_cents": 100,
            "transaction_date": "2026-09-30",
        },
    )

    assert response.status_code == 404


def test_list_orders_transactions_by_date_descending(client: TestClient) -> None:
    for transaction_date in ("2026-09-01", "2026-09-15"):
        assert (
            client.post(
                "/api/transactions",
                json={
                    "type": "expense",
                    "amount_cents": 100,
                    "transaction_date": transaction_date,
                },
            ).status_code
            == 201
        )

    listed = client.get("/api/transactions")

    assert listed.json()["items"][0]["transaction_date"] == "2026-09-15"


def test_monthly_summary_returns_income_expense_and_balance(client: TestClient) -> None:
    for transaction in (
        {
            "type": "income",
            "amount_cents": 10000,
            "transaction_date": "2026-09-01",
        },
        {
            "type": "expense",
            "amount_cents": 2500,
            "transaction_date": "2026-09-15",
        },
        {
            "type": "income",
            "amount_cents": 9000,
            "transaction_date": "2026-10-01",
        },
    ):
        assert client.post("/api/transactions", json=transaction).status_code == 201

    summary = client.get("/api/summary/monthly?year=2026&month=9")
    empty_summary = client.get("/api/summary/monthly?year=2025&month=1")

    assert summary.status_code == 200
    assert summary.json() == {
        "year": 2026,
        "month": 9,
        "income_cents": 10000,
        "expense_cents": 2500,
        "balance_cents": 7500,
    }
    assert empty_summary.json() == {
        "year": 2025,
        "month": 1,
        "income_cents": 0,
        "expense_cents": 0,
        "balance_cents": 0,
    }


def test_monthly_summary_rejects_invalid_month(client: TestClient) -> None:
    response = client.get("/api/summary/monthly?year=2026&month=13")

    assert response.status_code == 422


def test_monthly_summary_rejects_year_out_of_range(client: TestClient) -> None:
    response = client.get("/api/summary/monthly?year=10000&month=1")

    assert response.status_code == 422
