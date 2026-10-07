from fastapi import Request
from fastapi.responses import JSONResponse


class DentalScreeningError(Exception):
    """Base para todas las excepciones del dominio."""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ImageValidationError(DentalScreeningError):
    """La imagen no pasa los checks de calidad."""
    def __init__(self, message: str, suggestions: list[str] | None = None):
        super().__init__(message, status_code=422)
        self.suggestions = suggestions or []


class ImageTooLargeError(DentalScreeningError):
    def __init__(self, max_bytes: int):
        super().__init__(f"La imagen supera el límite de {max_bytes // (1024 * 1024)} MB.", status_code=413)


class ModelNotLoadedError(DentalScreeningError):
    def __init__(self, message: str = "El modelo de análisis no está disponible"):
        super().__init__(message, status_code=503)


class InferenceError(DentalScreeningError):
    def __init__(self):
        super().__init__("No se pudo completar el análisis de la imagen.", status_code=500)


# ── Handlers globales ────────────────────────────────────────────────────────

async def dental_screening_error_handler(
    request: Request, exc: DentalScreeningError
) -> JSONResponse:
    body: dict = {"error": exc.message}
    if isinstance(exc, ImageValidationError) and exc.suggestions:
        body["suggestions"] = exc.suggestions
    return JSONResponse(status_code=exc.status_code, content=body)


async def unhandled_error_handler(
    request: Request, exc: Exception
) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"error": "Error interno del servidor"},
    )
