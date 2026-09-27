from enum import Enum
from pydantic import BaseModel, Field


class PhotoType(str, Enum):
    mandibular = "mandibular"  # caries
    maxilar    = "maxilar"     # caries


class Diagnosis(str, Enum):
    ninguna = "ninguna"
    caries = "caries"


class BoundingBox(BaseModel):
    label: str
    confidence: float = Field(ge=0.0, le=1.0)
    x1: int
    y1: int
    x2: int
    y2: int


class DetectionResponse(BaseModel):
    id: int | None = None
    photo_type: str
    diagnosis: Diagnosis
    boxes: list[BoundingBox]
    image_width: int
    image_height: int
