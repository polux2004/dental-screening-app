from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Dental Screening API"
    debug: bool = False

    database_url: str = "sqlite:///./dental_screening.db"

    model_path: str = "app/ml/weights/best.pt"
    gingivitis_model_path: str = "app/ml/weights/bestgingivitis.pt"
    conf_threshold: float = 0.25
    iou_threshold: float = 0.45

    # Validación de imagen
    min_brightness: float = 50.0
    max_brightness: float = 220.0
    blur_threshold: float = 30.0   # Laplaciano — fotos dentales tienen textura baja por naturaleza (dientes lisos)

    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
