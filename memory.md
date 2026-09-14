# Memory — Bitácora del proyecto

Registro vivo de decisiones, aprendizajes y pendientes. 
Lo nuevo va arriba (orden inverso cronológico).

---

## Decisiones tomadas
- [2026-05-25] BLUR_THRESHOLD bajado de 100 a 30: fotos dentales tienen baja varianza de Laplaciano por naturaleza (dientes lisos/blancos), el umbral genérico rechazaba imágenes nítidas
- [2026-05-25] Sin webcam: captura solo por file upload (JPG/PNG/WEBP); app orientada a fotos desde smartphone, no sesión en vivo
- [2026-05-25] LandingPage agregada como entrada del flujo (antes del disclaimer): presenta el proyecto y su propósito
- [2026-05-25] InstructionsPage con 5 placeholders de imágenes guía (cuadros punteados por ángulo) — pendiente reemplazar con fotos reales
- [2026-05-24] Tailwind v3 (no v4): mayor estabilidad para tesis, ecosistema más documentado, requiere postcss.config.js
- [2026-05-24] SaveResult como modal en ResultsPage, no página propia: evita perder contexto visual de los resultados
- [2026-05-24] YOLOv8s como modelo base: balance velocidad/precisión adecuado para móvil; pesos en `backend/app/ml/weights/best.pt`
- [2026-05-24] SQLite para dev con SQLAlchemy; `DATABASE_URL` en `.env` permite migrar a PostgreSQL sin tocar código
- [2026-05-24] Singleton de ModelLoader con double-checked locking: cumple regla de carga única del modelo
- [2026-05-24] LABEL_MAP temporal: ambas clases del modelo (primary_caries, 
  permanent_caries) mapeadas a "caries" hasta tener modelo con gingivitis. 
  Solo para testing visual del flujo end-to-end.


## Aprendizajes / gotchas
<!-- Cosas no obvias que descubrimos. Formato: - [tema] qué pasa y cómo lidiamos -->


## Intentos descartados
- [umbrales relajados] Bajar MIN_BRIGHTNESS/MAX_BRIGHTNESS/BLUR_THRESHOLD para saltarse validación en testing: descartado porque el dataset test/ ya tiene fotos curadas y los umbrales bajos impiden probar CorrectionPage de forma natural.


## Pendientes / dudas abiertas
- [P1] Definir clases exactas del modelo entrenado (LABEL_MAP en inference_service.py asume 0=caries, 1=gingivitis — verificar con best.pt real)
- [P1] Colocar best.pt en `backend/app/ml/weights/` antes de correr el backend
- [P2] Decidir si se necesita Alembic para migraciones (actualmente se usa `create_all` en dev)
- [P2] Ajustar umbrales de validación de imagen (brightness/blur) con fotos reales del estudio
- [P1] Restaurar LABEL_MAP real (primary/permanent caries) cuando se decida 
  si la UI diferenciará tipos de caries o las agrupará
- [P1] Entrenar modelo con clase gingivitis para activar pantallas faltantes
- [P2] Mejorar precisión del modelo de caries (errores actuales pendientes)


## Estado actual
Stack corriendo localmente (2026-05-25). Flujo completo navegable: Landing → Aviso → Instrucciones → Captura (file upload) → Resultados. best.pt en su lugar. Pendiente: imágenes guía para InstructionsPage y validar flujo end-to-end con fotos reales.
