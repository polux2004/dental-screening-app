import logging

import cv2
import numpy as np

from app.config import settings
from app.ml.model_loader import ModelLoader
from app.schemas.detection import BoundingBox, DetectionResponse
from app.services.image_validator import validate_image
from app.utils.exceptions import ImageValidationError, InferenceError, ModelNotLoadedError

logger = logging.getLogger(__name__)

def run_detection(
    image_bytes: bytes,
    photo_type: str,
    model: ModelLoader,
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
        raise ModelNotLoadedError()

    try:
        prediction = model.predict(image)
    except Exception as exc:
        logger.exception("Falló la inferencia de caries")
        raise InferenceError() from exc

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

    return DetectionResponse(
        photo_type=photo_type,
        diagnosis="caries" if boxes else "ninguna",
        boxes=boxes,
        image_width=w,
        image_height=h,
    )
