# Dental Screening

Screening preliminar de caries y gingivitis en fotografías dentales (smartphone) para personas de 10–24 años.  
**No es diagnóstico médico** — siempre se muestra un disclaimer visible en la UI.

## Requisitos

- Python 3.11 y `pip`
- Node.js 20 y `npm`
- Docker + Docker Compose (para correr todo junto)
- Pesos del modelo YOLOv8s en `backend/app/ml/weights/best.pt`

## Correr en local (sin Docker)

### Backend

```bash
cd backend
cp .env.example .env          # ajusta si es necesario
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API disponible en `http://localhost:8000`  
Docs interactivos: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
cp .env.example .env.local    # ajusta VITE_API_URL si el backend no corre en :8000
npm install
npm run dev
```

App disponible en `http://localhost:5173`


## Estructura rápida

```
backend/app/
  api/        ← routers (solo orquestan)
  services/   ← lógica de negocio
  ml/         ← modelo YOLO (singleton)
  schemas/    ← Pydantic
  db/         ← SQLAlchemy + SQLite
  utils/      ← excepciones custom

frontend/src/
  pages/      ← pantallas de la app
  components/ ← ui/ (base) + componentes de dominio
  hooks/      ← useCamera
  services/   ← cliente axios
  router/     ← AppRouter
```

## Notas de desarrollo

- El modelo se carga **una sola vez** al arrancar el servidor (singleton).
- `CONF_THRESHOLD` se controla desde `.env`, nunca hardcodeado.
- Para producción, cambiar `DATABASE_URL` a PostgreSQL.
