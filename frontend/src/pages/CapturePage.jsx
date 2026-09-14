import { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { detectImage } from '../services/api'
import { ImagePlus, X, Loader2, Scan, Activity } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

// Fotos permitidas según enfermedad
const PHOTO_OPTIONS = {
  caries: [
    { value: 'mandibular', label: 'Mandibular' },
    { value: 'maxilar',    label: 'Maxilar' },
  ],
  gingivitis: [
    { value: 'frontal', label: 'Frontal' },
  ],
}

const DISEASE_META = {
  caries: {
    label: 'Caries',
    icon: Scan,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
    step: 'Paso 1 de 2',
  },
  gingivitis: {
    label: 'Gingivitis',
    icon: Activity,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    border: 'border-cyan-100',
    step: 'Paso 2 de 2',
  },
}

const ACCEPT = 'image/jpeg,image/png,image/webp'

export default function CapturePage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const analysisType    = state?.analysisType    ?? 'caries'
  const currentDisease  = state?.currentDisease  ?? 'caries'
  const previousResults = state?.previousResults ?? {}

  const photoOptions = PHOTO_OPTIONS[currentDisease]
  const meta = DISEASE_META[currentDisease]
  const Icon = meta.icon

  const inputRef = useRef(null)
  const [photoType, setPhotoType] = useState(photoOptions[0].value)
  const [preview, setPreview]     = useState(null)
  const [file, setFile]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setError(null)
  }

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const imageUrl = URL.createObjectURL(file)
      const result   = await detectImage(file, photoType)

      if (analysisType === 'ambas' && currentDisease === 'caries') {
        // Avanzar a captura de gingivitis
        navigate('/captura', {
          state: {
            analysisType: 'ambas',
            currentDisease: 'gingivitis',
            previousResults: { caries: result, cariesImageUrl: imageUrl },
          },
        })
      } else {
        // Ir a resultados
        navigate('/resultados', {
          state: {
            analysisType,
            cariesResult:        currentDisease === 'caries'     ? result   : previousResults.caries,
            cariesImageUrl:      currentDisease === 'caries'     ? imageUrl : previousResults.cariesImageUrl,
            gingivitisResult:    currentDisease === 'gingivitis' ? result   : null,
            gingivitisImageUrl:  currentDisease === 'gingivitis' ? imageUrl : null,
          },
        })
      }
    } catch (err) {
      if (err?.suggestions) {
        navigate('/correccion', { state: { suggestions: err.suggestions } })
      } else {
        setError(err?.error ?? 'Error al procesar la imagen.')
        setLoading(false)
      }
    }
  }

  const isSingleStep = analysisType !== 'ambas'

  return (
    <main className="min-h-screen page-bg flex flex-col items-center p-4 gap-4 animate-fade-in">
      <Card className="w-full max-w-md">

        {/* Encabezado de enfermedad */}
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-5 ${meta.bg} border ${meta.border}`}>
          <Icon className={`w-4 h-4 flex-shrink-0 ${meta.color}`} strokeWidth={1.8} />
          <div>
            <p className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>
              {isSingleStep ? 'Analizando' : meta.step} — {meta.label}
            </p>
            <p className="text-xs text-slate-500">
              {currentDisease === 'caries'
                ? 'Sube una foto mandibular o maxilar.'
                : 'Sube una foto frontal.'}
            </p>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-5">Subir foto dental</h1>

        {/* Selector de ángulo */}
        {photoOptions.length > 1 && (
          <div className="mb-5">
            <label className="block text-xs font-medium text-slate-500 mb-2">
              Tipo de fotografía
            </label>
            <div className="flex flex-wrap gap-2">
              {photoOptions.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setPhotoType(pt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border
                    ${photoType === pt.value
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Zona de imagen */}
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200
            hover:border-indigo-400 hover:bg-indigo-50/40 transition-all duration-200
            flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="w-full h-full object-contain" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                <ImagePlus className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-slate-600">Toca para seleccionar una foto</span>
              <span className="text-xs text-slate-400">JPG, PNG o WEBP</span>
            </>
          )}
        </button>

        <input ref={inputRef} type="file" accept={ACCEPT} onChange={handleFileChange} className="hidden" />

        {preview && (
          <button
            onClick={() => { setPreview(null); setFile(null); inputRef.current.value = '' }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-500 mb-3 transition-colors"
          >
            <X className="w-3 h-3" /> Cambiar imagen
          </button>
        )}

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <Button onClick={handleAnalyze} disabled={!file || loading}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Analizando…</span></>
            : <span>{analysisType === 'ambas' && currentDisease === 'caries' ? 'Continuar a gingivitis →' : 'Ver resultados'}</span>
          }
        </Button>
      </Card>
    </main>
  )
}
