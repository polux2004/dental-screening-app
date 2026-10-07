import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import detection, health
from app.config import settings
from app.db.migrations import ensure_analysis_type_column
from app.db.models import DetectionResult  # noqa: F401 — registra el modelo en Base
from app.db.session import Base, engine
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.upload_limit import UploadLimitMiddleware
from app.ml.gingivitis_loader import get_gingivitis_model
from app.ml.model_loader import get_caries_model
from app.utils.exceptions import (
    DentalScreeningError,
    dental_screening_error_handler,
    unhandled_error_handler,
)

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas (dev — en prod usar Alembic)
    Base.metadata.create_all(bind=engine)
    ensure_analysis_type_column()
    # Cargar los modelos al inicio.
    get_caries_model()
    get_gingivitis_model()
    yield


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(UploadLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
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
