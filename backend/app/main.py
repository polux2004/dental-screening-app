import logging
from contextlib import asynccontextmanager

logging.basicConfig(level=logging.INFO)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import detection, health
from app.config import settings
from app.db.models import DetectionResult  # noqa: F401 — registra el modelo en Base
from app.db.session import Base, engine
from app.ml.model_loader import get_caries_model, get_gingivitis_model
from app.utils.exceptions import (
    DentalScreeningError,
    dental_screening_error_handler,
    unhandled_error_handler,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas (dev — en prod usar Alembic)
    Base.metadata.create_all(bind=engine)
    # Cargar modelos al inicio (singleton — gingivitis puede no existir aún)
    get_caries_model()
    get_gingivitis_model()
    yield


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(DentalScreeningError, dental_screening_error_handler)
app.add_exception_handler(Exception, unhandled_error_handler)

app.include_router(health.router)
app.include_router(detection.router)
