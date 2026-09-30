import os
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

from alembic.config import Config
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from alembic import command
from app.models import Transaction
from app.seed import seed_database


def test_seed_is_idempotent(tmp_path: Path) -> None:
    database_path = tmp_path / "seed_test"
    config = Config(str(Path(__file__).parents[1] / "alembic.ini"))
    config.set_main_option("sqlalchemy.url", f"sqlite:///{database_path}")
    command.upgrade(config, "head")
    engine = create_engine(f"sqlite:///{database_path}")

    try:
        with Session(engine) as session:
            seed_database(session)
            first_count = len(session.scalars(select(Transaction)).all())

            seed_database(session)
            second_count = len(session.scalars(select(Transaction)).all())
    finally:
        command.downgrade(config, "base")
        engine.dispose()

    assert first_count > 0
    assert second_count == first_count


def test_seed_reuses_example_identity_after_row_changes(tmp_path: Path) -> None:
    database_path = tmp_path / "seed_identity_test"
    config = Config(str(Path(__file__).parents[1] / "alembic.ini"))
    config.set_main_option("sqlalchemy.url", f"sqlite:///{database_path}")
    command.upgrade(config, "head")
    engine = create_engine(f"sqlite:///{database_path}")

    try:
        with Session(engine) as session:
            seed_database(session)
            example = session.scalars(select(Transaction)).first()
            assert example is not None
            example.description = "Dato editado por el usuario"
            session.commit()

            seed_database(session)

            assert len(session.scalars(select(Transaction)).all()) == 2
            assert (
                session.get(Transaction, example.id).description
                == "Dato editado por el usuario"
            )
    finally:
        command.downgrade(config, "base")
        engine.dispose()


def test_seed_does_not_consider_matching_real_row_as_example(tmp_path: Path) -> None:
    database_path = tmp_path / "seed_collision_test"
    config = Config(str(Path(__file__).parents[1] / "alembic.ini"))
    config.set_main_option("sqlalchemy.url", f"sqlite:///{database_path}")
    command.upgrade(config, "head")
    engine = create_engine(f"sqlite:///{database_path}")

    try:
        with Session(engine) as session:
            session.add(
                Transaction(
                    type="income",
                    amount_cents=250000,
                    transaction_date=date(2026, 9, 1),
                    description="Ejemplo de nómina",
                )
            )
            session.commit()

            seed_database(session)

            assert len(session.scalars(select(Transaction)).all()) == 3
    finally:
        command.downgrade(config, "base")
        engine.dispose()


def test_seed_command_migrates_and_seeds_from_repository_root(tmp_path: Path) -> None:
    source_backend = Path(__file__).parents[1]
    isolated_backend = tmp_path / "backend"
    shutil.copytree(
        source_backend / "app",
        isolated_backend / "app",
        ignore=shutil.ignore_patterns("__pycache__"),
    )
    shutil.copytree(
        source_backend / "alembic",
        isolated_backend / "alembic",
        ignore=shutil.ignore_patterns("__pycache__"),
    )
    shutil.copy(source_backend / "alembic.ini", isolated_backend / "alembic.ini")

    environment = os.environ.copy()
    environment["PYTHONPATH"] = str(isolated_backend)
    database_path = isolated_backend / "data" / "myfinancepal_test.db"
    environment["MYFINANCEPAL_DATABASE_PATH"] = str(database_path)
    command = [sys.executable, "-m", "app.seed"]

    subprocess.run(command, cwd=tmp_path, env=environment, check=True)
    subprocess.run(command, cwd=tmp_path, env=environment, check=True)

    engine = create_engine(f"sqlite:///{database_path}")
    try:
        with Session(engine) as session:
            assert len(session.scalars(select(Transaction)).all()) == 2
    finally:
        engine.dispose()
