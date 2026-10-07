import json
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.dependencies import DBSession
from app.config import settings
from app.ml.gingivitis_loader import get_gingivitis_model
from app.ml.model_loader import get_caries_model
from app.schemas.detection import (
    AnalysisType,
    DetectionResponse,
    PhotoType,
)
from app.services.inference_service import run_detection
from app.services.image_validator import validate_file_format
from app.db.models import DetectionResult
from app.utils.exceptions import ImageTooLargeError

router = APIRouter(prefix="/detect", tags=["detection"])


@router.post("/", response_model=DetectionResponse)
async def detect(
    photo_type: Annotated[PhotoType, Form()],
    file: Annotated[UploadFile, File()],
    db: DBSession,
    analysis_type: Annotated[AnalysisType, Form()] = AnalysisType.caries,
):
    if analysis_type == AnalysisType.caries and photo_type == PhotoType.frontal:
        raise HTTPException(status_code=422, detail="Caries requiere una foto mandibular o maxilar")
    if analysis_type == AnalysisType.gingivitis and photo_type != PhotoType.frontal:
        raise HTTPException(status_code=422, detail="Gingivitis requiere una foto frontal")

    image_bytes = await file.read(settings.max_upload_bytes + 1)
    if len(image_bytes) > settings.max_upload_bytes:
        raise ImageTooLargeError(settings.max_upload_bytes)
    validate_file_format(file.filename, image_bytes)
    model = get_caries_model() if analysis_type == AnalysisType.caries else get_gingivitis_model()
    result = run_detection(image_bytes, photo_type.value, analysis_type, model)

    record = DetectionResult(
        analysis_type=result.analysis_type.value,
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
