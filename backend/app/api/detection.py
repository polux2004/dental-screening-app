import json
from typing import Annotated

from fastapi import APIRouter, File, Form, UploadFile

from app.dependencies import DBSession
from app.config import settings
from app.ml.model_loader import get_caries_model
from app.schemas.detection import (
    DetectionResponse,
    PhotoType,
)
from app.services.inference_service import run_detection
from app.db.models import DetectionResult
from app.utils.exceptions import ImageTooLargeError

router = APIRouter(prefix="/detect", tags=["detection"])


@router.post("/", response_model=DetectionResponse)
async def detect(
    photo_type: Annotated[PhotoType, Form()],
    file: Annotated[UploadFile, File()],
    db: DBSession,
):
    image_bytes = await file.read(settings.max_upload_bytes + 1)
    if len(image_bytes) > settings.max_upload_bytes:
        raise ImageTooLargeError(settings.max_upload_bytes)
    result = run_detection(image_bytes, photo_type.value, get_caries_model())

    record = DetectionResult(
        photo_type=result.photo_type,
        diagnosis=result.diagnosis,
        boxes_json=json.dumps([b.model_dump() for b in result.boxes]),
        image_width=result.image_width,
        image_height=result.image_height,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return DetectionResponse(id=record.id, **result.model_dump(exclude={"id"}))
