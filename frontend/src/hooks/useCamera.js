import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Maneja el ciclo de vida del stream de la cámara.
 * Devuelve la ref del <video>, una función para capturar y el estado de error.
 */
export function useCamera() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => setReady(true)
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setReady(false)
  }, [])

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video || !ready) return null
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
  }, [ready])

  useEffect(() => () => stopCamera(), [stopCamera])

  return { videoRef, ready, error, startCamera, stopCamera, captureFrame }
}
