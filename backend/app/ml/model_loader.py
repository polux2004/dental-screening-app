import threading
from pathlib import Path

from ultralytics import YOLO

from app.config import settings


class ModelLoader:
    """Singleton por clave — soporta múltiples modelos (caries, gingivitis, etc.)."""

    _instances: dict[str, "ModelLoader"] = {}
    _lock = threading.Lock()

    def __init__(self, model_path: str):
        path = Path(model_path)
        self.available = path.exists()
        if self.available:
            self.model = YOLO(str(path))
        self.conf_threshold = settings.conf_threshold
        self.iou_threshold = settings.iou_threshold

    @classmethod
    def get(cls, key: str, model_path: str) -> "ModelLoader":
        if key not in cls._instances:
            with cls._lock:
                if key not in cls._instances:
                    cls._instances[key] = cls(model_path)
        return cls._instances[key]

    def predict(self, image):
        if not self.available:
            return None
        return self.model.predict(
            source=image,
            conf=self.conf_threshold,
            iou=self.iou_threshold,
            imgsz=640,
            verbose=False,
        )


def get_caries_model() -> ModelLoader:
    return ModelLoader.get("caries", settings.model_path)


def get_gingivitis_model() -> ModelLoader:
    return ModelLoader.get("gingivitis", settings.gingivitis_model_path)
