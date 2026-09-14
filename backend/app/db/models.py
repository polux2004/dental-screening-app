from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class DetectionResult(Base):
    __tablename__ = "detection_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    photo_type: Mapped[str] = mapped_column(String(20), nullable=False)
    diagnosis: Mapped[str] = mapped_column(String(20), nullable=False)
    # JSON serializado de los bounding boxes
    boxes_json: Mapped[str] = mapped_column(Text, nullable=False, default="[]")
    image_width: Mapped[int] = mapped_column(Integer, nullable=False)
    image_height: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
