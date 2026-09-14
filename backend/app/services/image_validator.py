import logging

import cv2
import numpy as np

from app.config import settings
from app.utils.exceptions import ImageValidationError

logger = logging.getLogger(__name__)


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

    # ── Nitidez (varianza del Laplaciano) ────────────────────────────────────
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
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
