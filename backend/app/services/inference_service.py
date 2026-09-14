import cv2
import numpy as np

from app.ml.model_loader import ModelLoader, get_caries_model, get_gingivitis_model
from app.schemas.detection import BoundingBox, DetectionResponse
from app.services.image_validator import validate_image
from app.utils.exceptions import InferenceError

# Foto frontal → gingivitis; mandibular/maxilar → caries
GINGIVITIS_PHOTO_TYPES = {"frontal"}

CARIES_LABEL_MAP: dict[int, str] = {
    0: "caries",  # primary_caries
    1: "caries",  # permanent_caries
}

# Ajustar cuando llegue el modelo de gingivitis
GINGIVITIS_LABEL_MAP: dict[int, str] = {
    0: "gingivitis",
}


def run_detection(
    image_bytes: bytes,
    photo_type: str,
    model: ModelLoader,
) -> DetectionResponse:
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if image is None:
        raise InferenceError("No se pudo decodificar la imagen.")

    validate_image(image)

    is_gingivitis = photo_type in GINGIVITIS_PHOTO_TYPES
    label_map = GINGIVITIS_LABEL_MAP if is_gingivitis else CARIES_LABEL_MAP

    h, w = image.shape[:2]

    # Si el modelo no está disponible aún, devolver resultado vacío
    if not model.available:
        return DetectionResponse(
            photo_type=photo_type,
            diagnosis="ninguna",
            boxes=[],
            image_width=w,
            image_height=h,
        )

    try:
        results = model.predict(image)
    except Exception as exc:
        raise InferenceError(str(exc)) from exc

    boxes: list[BoundingBox] = []
    detected_classes: set[str] = set()

    if results and results[0].boxes is not None:
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            label = label_map.get(cls_id, f"clase_{cls_id}")
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            boxes.append(
                BoundingBox(
                    label=label,
                    confidence=round(conf, 4),
                    x1=round(x1), y1=round(y1),
                    x2=round(x2), y2=round(y2),
                )
            )
            detected_classes.add(label)

    if is_gingivitis:
        diagnosis = "gingivitis" if detected_classes else "ninguna"
    else:
        diagnosis = "caries" if detected_classes else "ninguna"

    return DetectionResponse(
        photo_type=photo_type,
        diagnosis=diagnosis,
        boxes=boxes,
        image_width=w,
        image_height=h,
    )
