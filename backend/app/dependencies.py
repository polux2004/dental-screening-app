from collections.abc import Generator
from typing import Annotated

from fastapi import Depends

from app.db.session import SessionLocal
from sqlalchemy.orm import Session


# ── Base de datos ────────────────────────────────────────────────────────────

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DBSession = Annotated[Session, Depends(get_db)]
