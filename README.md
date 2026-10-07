# Dental Screening

Proyecto web para explorar posibles indicios visuales de caries y gingivitis en fotografías dentales de personas de 10 a 24 años. Ambos análisis están disponibles localmente: caries con Faster R-CNN y gingivitis con YOLOv8s-seg. El resultado es **orientativo y no constituye un diagnóstico médico**.

## Tecnologías

- **Frontend:** React 18, Vite, React Router, Tailwind CSS y Axios.
- **Backend:** Python 3.11, FastAPI, Pydantic, OpenCV, NumPy, PyTorch/TorchVision con Faster R-CNN ResNet50-FPN y Ultralytics YOLOv8s-seg.
- **Datos:** SQLAlchemy y SQLite para desarrollo local.

## Ejecutar localmente

Se necesitan Python 3.11, Node.js 20 y npm. Abre dos terminales desde la raíz del repositorio.

### Backend

Primera instalación:

```bash
cd backend
cp .env.example .env
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

En las siguientes ocasiones, solo activa `.venv` y ejecuta `uvicorn`. La API responde en `http://localhost:8000`; su documentación interactiva está en `http://localhost:8000/docs`.

### Frontend

Primera instalación:

```bash
cd frontend
cp .env.example .env.local
npm ci
npm run dev -- --host 127.0.0.1
```

En las siguientes ocasiones, ejecuta `npm run dev -- --host 127.0.0.1` desde `frontend`. Abre **http://localhost:5173/** en el navegador. En macOS con `node@20` de Homebrew, si `npm` no está en `PATH`, antepón `PATH="/opt/homebrew/opt/node@20/bin:$PATH"` al comando.

Detén cada servidor con `Ctrl+C` en su terminal.

## Modelos

El backend busca el checkpoint de caries en `backend/app/ml/weights/best.pt`. Debe contener `model_state` de Faster R-CNN ResNet50-FPN con dos clases: fondo y caries. El modelo de gingivitis se carga desde `backend/app/ml/weights/best_gingivitis.pt` y debe ser un checkpoint de segmentación de Ultralytics YOLO con la clase `gingivitis`. Los pesos no se versionan en Git. Si falta el modelo elegido o no se puede cargar, ese análisis responde con `503`.

## Arquitectura y flujo

1. React permite elegir caries o gingivitis. Caries acepta fotos mandibulares o maxilares; gingivitis requiere una foto frontal.
2. Axios envía la imagen, el tipo de foto y `analysis_type` a `POST /detect/`. Si se omite `analysis_type`, la API conserva caries como valor predeterminado.
3. FastAPI acepta solo JPG, JPEG o PNG comprobando extensión y firma; luego comprueba la calidad y ejecuta Faster R-CNN o YOLOv8s-seg según la elección.
4. La API devuelve posibles hallazgos, coordenadas y polígonos de segmentación cuando corresponde; React los dibuja sobre la fotografía.
5. SQLAlchemy registra el resultado en SQLite. La fotografía original no se guarda en la base de datos.

El brillo promedio permitido va de 85 a 245 en el canal V de HSV (escala 0–255). También se comprueban la nitidez, un tamaño mínimo de 100 × 100 píxeles y el límite de 10 MB.

El código del frontend está en `frontend/src/`: `pages/` para pantallas, `components/` para elementos reutilizables, `router/` para rutas y `services/` para la API. En `backend/app/`, `api/` define endpoints, `services/` contiene la lógica, `ml/` carga modelos, `schemas/` valida datos y `db/` administra la base de datos.

## Estado del proyecto

La interfaz y la API funcionan localmente; todavía no está previsto desplegarlas. Ambos análisis utilizan los checkpoints proporcionados y todavía deben validarse con imágenes reales del estudio. Las pruebas de seguridad y funcionalidad realizadas hasta ahora se conservan solo en el entorno local y no se versionan en este repositorio.
