import json

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.dependencies import DBSession
from app.ml.model_loader import get_caries_model, get_gingivitis_model
from app.schemas.detection import (
    DetectionResponse,
    PhotoType,
    SaveResultRequest,
    SaveResultResponse,
)
from app.services.inference_service import run_detection, GINGIVITIS_PHOTO_TYPES
from app.db.models import DetectionResult

router = APIRouter(prefix="/detect", tags=["detection"])


@router.post("/", response_model=DetectionResponse)
async def detect(
    photo_type: PhotoType = Form(...),
    file: UploadFile = File(...),
    db: DBSession = None,
):
    # Seleccionar modelo según tipo de foto
    model = get_gingivitis_model() if photo_type.value in GINGIVITIS_PHOTO_TYPES else get_caries_model()

    image_bytes = await file.read()
    result = run_detection(image_bytes, photo_type.value, model)

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


@router.post("/save", response_model=SaveResultResponse)
async def save_result(
    payload: SaveResultRequest,
    db: DBSession,
):
    record = db.get(DetectionResult, payload.detection_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Resultado no encontrado.")
    record.notes = payload.notes
    db.commit()
    db.refresh(record)
    return SaveResultResponse(id=record.id, saved=True)
