import logging
import threading
from pathlib import Path

import cv2
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn

from app.config import settings
from app.utils.exceptions import ModelNotLoadedError

logger = logging.getLogger(__name__)


class ModelLoader:
    """Carga una sola vez el detector de caries Faster R-CNN."""

    _instance: "ModelLoader | None" = None
    _lock = threading.Lock()

    def __init__(self, model_path: str):
        self.model = None
        self.available = False
        path = Path(model_path)

        if not path.is_file():
            logger.warning("No se encontró el modelo de caries en %s", path)
            return

        try:
            checkpoint = torch.load(path, map_location="cpu", weights_only=True, mmap=True)
            state = checkpoint["model_state"]
            class_count = state["roi_heads.box_predictor.cls_score.weight"].shape[0]
            if class_count != 2:
                raise ValueError(f"Se esperaban 2 clases (fondo y caries); hay {class_count}")

            model = fasterrcnn_resnet50_fpn(
                weights=None,
                weights_backbone=None,
                num_classes=class_count,
            )
            model.load_state_dict(state, strict=True)
            model.eval()
            self.model = model
            self.available = True
            logger.info("Modelo Faster R-CNN de caries cargado desde %s", path)
        except Exception:
            logger.exception("No se pudo cargar el modelo Faster R-CNN en %s", path)

    @classmethod
    def get(cls) -> "ModelLoader":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls(settings.model_path)
        return cls._instance

    def predict(self, image):
        if not self.available:
            raise ModelNotLoadedError()

        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        tensor = torch.from_numpy(rgb).permute(2, 0, 1).float().div(255)
        with torch.inference_mode():
            return self.model([tensor])[0]


def get_caries_model() -> ModelLoader:
    return ModelLoader.get()
