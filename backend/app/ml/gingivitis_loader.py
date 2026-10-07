import logging
import threading
from pathlib import Path

from ultralytics import YOLO

from app.config import settings
from app.utils.exceptions import ModelNotLoadedError

logger = logging.getLogger(__name__)


class GingivitisModelLoader:
    """Carga una vez el modelo YOLOv8 de segmentación de gingivitis."""

    _instance: "GingivitisModelLoader | None" = None
    _lock = threading.Lock()

    def __init__(self, model_path: str):
        self.model = None
        self.available = False
        self._predict_lock = threading.Lock()
        path = Path(model_path)

        if not path.is_file():
            logger.warning("No se encontró el modelo de gingivitis en %s", path)
            return

        try:
            model = YOLO(str(path))
            if model.task != "segment" or set(model.names.values()) != {"gingivitis"}:
                raise ValueError(
                    f"Se esperaba segmentación de gingivitis; task={model.task}, names={model.names}"
                )
            self.model = model
            self.available = True
            logger.info("Modelo de gingivitis cargado desde %s", path)
        except Exception:
            logger.exception("No se pudo cargar el modelo de gingivitis en %s", path)

    @classmethod
    def get(cls) -> "GingivitisModelLoader":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls(settings.gingivitis_model_path)
        return cls._instance

    def predict(self, image):
        if not self.available:
            raise ModelNotLoadedError("El modelo de gingivitis no está disponible")

        with self._predict_lock:
            return self.model.predict(
                source=image,
                conf=settings.conf_threshold,
                retina_masks=True,
                device="cpu",
                verbose=False,
            )[0]


def get_gingivitis_model() -> GingivitisModelLoader:
    return GingivitisModelLoader.get()
