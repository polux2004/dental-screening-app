import logging
from pathlib import Path

import cv2
import numpy as np

from app.config import settings
from app.utils.exceptions import ImageValidationError

logger = logging.getLogger(__name__)

PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
JPEG_SIGNATURE = b"\xff\xd8\xff"


def validate_file_format(filename: str | None, image_bytes: bytes) -> None:
    """Exige una extensión y una firma real de PNG o JPEG."""
    suffix = Path(filename or "").suffix.lower()
    valid = (
        (suffix == ".png" and image_bytes.startswith(PNG_SIGNATURE))
        or (suffix in {".jpg", ".jpeg"} and image_bytes.startswith(JPEG_SIGNATURE))
    )
    if not valid:
        raise ImageValidationError(
            message="Solo se aceptan imágenes JPG, JPEG o PNG.",
            suggestions=["Selecciona una imagen JPG, JPEG o PNG válida."],
        )


def validate_image(image: np.ndarray) -> None:
    """
    Lanza ImageValidationError con sugerencias específicas si la imagen
    no cumple los criterios de calidad.
    """
    suggestions: list[str] = []

    # ── Iluminación (canal V en HSV) ─────────────────────────────────────────
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    brightness = float(hsv[:, :, 2].mean())

    if brightness < settings.min_brightness:
        suggestions.append("La imagen está muy oscura. Acércate a una fuente de luz o activa el flash.")
    elif brightness > settings.max_brightness:
        suggestions.append("La imagen está sobreexpuesta. Aleja la fuente de luz o evita el flash directo.")

    # Comparar fotos a una resolución común evita penalizar imágenes grandes.
    height, width = image.shape[:2]
    longest_side = max(height, width)
    focus_image = image
    if longest_side > 1024:
        scale = 1024 / longest_side
        focus_image = cv2.resize(
            image,
            (round(width * scale), round(height * scale)),
            interpolation=cv2.INTER_AREA,
        )

    # ── Nitidez (varianza del Laplaciano a 1024 px como máximo) ──────────────
    gray = cv2.cvtColor(focus_image, cv2.COLOR_BGR2GRAY)
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    logger.info(
        "VALIDACION | shape=%s | brightness=%.1f (min=%.0f max=%.0f) | blur=%.1f (threshold=%.0f)",
        image.shape, brightness,
        settings.min_brightness, settings.max_brightness,
        blur_score, settings.blur_threshold,
    )

    if blur_score < settings.blur_threshold:
        suggestions.append("La imagen está borrosa. Mantén el teléfono firme y asegúrate de que los dientes estén enfocados.")

    # ── Encuadre mínimo (imagen no vacía / negra) ────────────────────────────
    if image.shape[0] < 100 or image.shape[1] < 100:
        suggestions.append("La imagen es demasiado pequeña. Acércate más a los dientes.")

    if suggestions:
        raise ImageValidationError(
            message="La imagen no cumple los requisitos de calidad.",
            suggestions=suggestions,
        )
