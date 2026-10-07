from sqlalchemy import inspect, text

from app.db.session import engine


def ensure_analysis_type_column() -> None:
    """Conserva los resultados existentes al ampliar la tabla local."""
    with engine.begin() as connection:
        columns = {column["name"] for column in inspect(connection).get_columns("detection_results")}
        if "analysis_type" not in columns:
            connection.execute(
                text(
                    "ALTER TABLE detection_results "
                    "ADD COLUMN analysis_type VARCHAR(20) NOT NULL DEFAULT 'caries'"
                )
            )
