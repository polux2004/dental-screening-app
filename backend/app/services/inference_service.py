import logging

import cv2
import numpy as np

from app.config import settings
from app.ml.gingivitis_loader import GingivitisModelLoader
from app.ml.model_loader import ModelLoader
from app.schemas.detection import AnalysisType, BoundingBox, DetectionResponse, PolygonPoint
from app.services.image_validator import validate_image
from app.utils.exceptions import ImageValidationError, InferenceError, ModelNotLoadedError

logger = logging.getLogger(__name__)

def run_detection(
    image_bytes: bytes,
    photo_type: str,
    analysis_type: AnalysisType,
    model: ModelLoader | GingivitisModelLoader,
) -> DetectionResponse:
    nparr = np.frombuffer(image_bytes, np.uint8)
    try:
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except cv2.error as exc:
        raise ImageValidationError("El archivo no es una imagen válida.") from exc
    if image is None:
        raise ImageValidationError("El archivo no es una imagen válida.")

    validate_image(image)

    h, w = image.shape[:2]

    # La ausencia de un modelo no equivale a una imagen sin hallazgos.
    if not model.available:
        raise ModelNotLoadedError(f"El modelo de {analysis_type.value} no está disponible")

    try:
        prediction = model.predict(image)
        if analysis_type == AnalysisType.caries:
            boxes = _caries_boxes(prediction)
        else:
            boxes = _gingivitis_boxes(prediction)
    except Exception as exc:
        logger.exception("Falló la inferencia de %s", analysis_type.value)
        raise InferenceError() from exc

    return DetectionResponse(
        analysis_type=analysis_type,
        photo_type=photo_type,
        diagnosis=analysis_type.value if boxes else "ninguna",
        boxes=boxes,
        image_width=w,
        image_height=h,
    )


def _caries_boxes(prediction) -> list[BoundingBox]:
    boxes: list[BoundingBox] = []
    for coords, class_id, confidence in zip(
        prediction["boxes"], prediction["labels"], prediction["scores"], strict=True
    ):
        if int(class_id) != 1 or float(confidence) < settings.conf_threshold:
            continue
        x1, y1, x2, y2 = (round(value) for value in coords.tolist())
        boxes.append(
            BoundingBox(
                label="caries",
                confidence=round(float(confidence), 4),
                x1=x1, y1=y1, x2=x2, y2=y2,
            )
        )
    return boxes


def _gingivitis_boxes(prediction) -> list[BoundingBox]:
    if prediction.boxes is None or len(prediction.boxes) == 0:
        return []
    if prediction.masks is None:
        raise ValueError("El modelo de segmentación devolvió detecciones sin máscaras")

    contours = prediction.masks.xy
    if len(contours) != len(prediction.boxes):
        raise ValueError("La cantidad de máscaras no coincide con las detecciones")

    boxes: list[BoundingBox] = []
    for box, contour in zip(prediction.boxes, contours, strict=True):
        confidence = float(box.conf.item())
        if int(box.cls.item()) != 0 or confidence < settings.conf_threshold:
            continue

        x1, y1, x2, y2 = (round(float(value)) for value in box.xyxy[0].tolist())
        polygon = [
            PolygonPoint(x=round(float(x)), y=round(float(y)))
            for x, y in contour
        ]
        boxes.append(
            BoundingBox(
                label="gingivitis",
                confidence=round(confidence, 4),
                x1=x1, y1=y1, x2=x2, y2=y2,
                polygon=polygon if len(polygon) >= 3 else None,
            )
        )
    return boxes
