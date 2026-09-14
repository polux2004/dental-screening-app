# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Dental Screening — Contexto del proyecto

Screening preliminar de caries y gingivitis en fotos dentales (smartphone) 
para personas de 10–24 años. Tesis universitaria.
**No es diagnóstico médico** — siempre disclaimer visible en UI.

## Stack
- **Backend**: Python 3.11, FastAPI, Ultralytics (YOLOv8s), OpenCV, Pydantic v2, SQLAlchemy + SQLite
- **Frontend**: React 18 + Vite, React Router, Axios, TailwindCSS
- **Modelo**: `backend/app/ml/weights/best.pt` (entrenado en Colab — NO re-entrenar acá)

## Estructura (no inventar carpetas nuevas sin avisar)
backend/app/  → api/ services/ ml/ schemas/ db/ utils/
frontend/src/ → pages/ components/ router/ services/ hooks/

## Reglas no negociables
- Modelo YOLO se carga UNA sola vez al iniciar (singleton vía dependencia FastAPI), nunca por request
- Rutas (`api/`) solo orquestan; la lógica vive en `services/`
- Variables sensibles solo en `.env` (versionar `.env.example`, nunca `.env`)
- Umbral de confianza viene de `.env` (`CONF_THRESHOLD`), no hardcodeado
- Componentes React pequeños y reutilizables; UI base en `components/ui/`
- Cero credenciales, claves o rutas absolutas en código
- Idioma de UI: español (PE)

## Comandos
- Backend dev:  `cd backend && uvicorn app.main:app --reload`
- Frontend dev: `cd frontend && npm run dev`
- Todo junto:   `docker-compose up`

## Flujo de pantallas
`/` LandingPage → `/aviso` DisclaimerPage → `/instrucciones` InstructionsPage → `/captura` CapturePage → `/resultados` ResultsPage

## Memoria viva
- Leer `memory.md` al iniciar cada sesión.
- Después de cada cambio relevante de código, actualizar `memory.md` sin preguntar: decisiones en "Decisiones tomadas", problemas en "Aprendizajes", cosas que no funcionaron en "Intentos descartados", y reescribir "Estado actual".