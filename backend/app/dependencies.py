from collections.abc import Generator
from typing import Annotated

from fastapi import Depends

from app.db.session import SessionLocal
from app.ml.model_loader import ModelLoader
from sqlalchemy.orm import Session


# ── Base de datos ────────────────────────────────────────────────────────────

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


DBSession = Annotated[Session, Depends(get_db)]


# ── Modelo YOLO (singleton) ──────────────────────────────────────────────────

def get_model() -> ModelLoader:
    """
    Devuelve la instancia singleton del modelo.
    FastAPI resuelve esta dependencia una sola vez por proceso.
    """
    return ModelLoader.get_instance()


YOLOModel = Annotated[ModelLoader, Depends(get_model)]
