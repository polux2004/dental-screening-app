# Dental Screening

Proyecto web para explorar posibles indicios visuales de caries y gingivitis en fotografías dentales de personas de 10 a 24 años. Ambas áreas se presentan en la interfaz: el análisis de caries está disponible localmente y el de gingivitis sigue en desarrollo. El resultado es **orientativo y no constituye un diagnóstico médico**.

## Tecnologías

- **Frontend:** React 18, Vite, React Router, Tailwind CSS y Axios.
- **Backend:** Python 3.11, FastAPI, Pydantic, OpenCV, NumPy y PyTorch/TorchVision con Faster R-CNN ResNet50-FPN.
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

El backend busca el checkpoint de caries en `backend/app/ml/weights/best.pt`. Debe contener `model_state` de Faster R-CNN ResNet50-FPN con dos clases: fondo y caries. Los pesos no se versionan en Git. Si falta el archivo o no se puede cargar, el análisis responde con `503` en lugar de presentar un resultado vacío. La técnica de análisis de gingivitis aún no está definida, por lo que no se ofrece un endpoint ni se presupone una arquitectura de modelo para ella.

## Arquitectura y flujo

1. React presenta caries y gingivitis con sus estados actuales. El análisis de caries permite subir una fotografía mandibular o maxilar; gingivitis se muestra en desarrollo.
2. Axios envía la imagen y su tipo a `POST /detect/`.
3. FastAPI comprueba la calidad de la imagen y ejecuta Faster R-CNN para caries.
4. La API devuelve posibles hallazgos y coordenadas; React los dibuja sobre la fotografía.
5. SQLAlchemy registra el resultado en SQLite. La fotografía original no se guarda en la base de datos.

El código del frontend está en `frontend/src/`: `pages/` para pantallas, `components/` para elementos reutilizables, `router/` para rutas y `services/` para la API. En `backend/app/`, `api/` define endpoints, `services/` contiene la lógica, `ml/` carga modelos, `schemas/` valida datos y `db/` administra la base de datos.

## Estado del proyecto

La interfaz y la API funcionan localmente; todavía no está previsto desplegarlas. La inferencia de caries utiliza el checkpoint proporcionado y todavía debe validarse con imágenes reales del estudio. Gingivitis está en construcción. Las pruebas de seguridad y funcionalidad realizadas hasta ahora se conservan solo en el entorno local y no se versionan en este repositorio.
