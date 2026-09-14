from enum import Enum
from pydantic import BaseModel, Field


class PhotoType(str, Enum):
    frontal    = "frontal"     # gingivitis
    mandibular = "mandibular"  # caries
    maxilar    = "maxilar"     # caries


class Diagnosis(str, Enum):
    ninguna = "ninguna"
    caries = "caries"
    gingivitis = "gingivitis"
    ambas = "ambas"


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


class SaveResultRequest(BaseModel):
    detection_id: int
    notes: str | None = Field(default=None, max_length=500)


class SaveResultResponse(BaseModel):
    id: int
    saved: bool
