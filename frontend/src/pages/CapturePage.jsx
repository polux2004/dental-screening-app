import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { detectImage } from '../services/api'
import { ImagePlus, X, Loader2, Scan, Activity } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const CARIES_PHOTO_OPTIONS = [
  { value: 'mandibular', label: 'Mandibular' },
  { value: 'maxilar', label: 'Maxilar' },
]

const GINGIVITIS_PHOTO_OPTIONS = [
  { value: 'frontal', label: 'Frontal' },
]

const ACCEPT = '.jpg,.jpeg,.png,image/jpeg,image/png'

export default function CapturePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const analysisType = searchParams.get('analysis') === 'gingivitis' ? 'gingivitis' : 'caries'
  const photoOptions = analysisType === 'gingivitis' ? GINGIVITIS_PHOTO_OPTIONS : CARIES_PHOTO_OPTIONS

  const inputRef = useRef(null)
  const [photoType, setPhotoType] = useState(photoOptions[0].value)
  const [preview, setPreview]     = useState(null)
  const [file, setFile]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!/\.(jpe?g|png)$/i.test(selected.name)) {
      setFile(null)
      setPreview(null)
      e.target.value = ''
      setError('Solo se aceptan archivos JPG, JPEG o PNG.')
      return
    }
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
      const result   = await detectImage(file, photoType, analysisType)
      navigate('/resultados', { state: { result, imageUrl } })
    } catch (err) {
      if (err?.suggestions) {
        navigate('/correccion', { state: { suggestions: err.suggestions, analysisType } })
      } else {
        setError(err?.error ?? 'Error al procesar la imagen.')
        setLoading(false)
      }
    }
  }

  return (
    <main className="min-h-screen page-bg flex flex-col items-center p-4 gap-4 animate-fade-in">
      <Card className="w-full max-w-md">

        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-5 ${analysisType === 'gingivitis' ? 'bg-cyan-50 border border-cyan-100' : 'bg-teal-50 border border-teal-100'}`}>
          {analysisType === 'gingivitis'
            ? <Activity className="w-4 h-4 flex-shrink-0 text-cyan-600" strokeWidth={1.8} />
            : <Scan className="w-4 h-4 flex-shrink-0 text-teal-600" strokeWidth={1.8} />}
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-600">Análisis de {analysisType}</p>
            <p className="text-xs text-slate-500">{analysisType === 'gingivitis' ? 'Sube una foto frontal de dientes y encías.' : 'Sube una foto mandibular o maxilar.'}</p>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-5">Subir foto dental</h1>

        {/* Selector de ángulo */}
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
                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:text-teal-600'
                  }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zona de imagen */}
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200
            hover:border-teal-400 hover:bg-teal-50/40 transition-all duration-200
            flex flex-col items-center justify-center gap-2 mb-4 overflow-hidden"
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="w-full h-full object-contain" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                <ImagePlus className="w-5 h-5 text-teal-500" strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-slate-600">Toca para seleccionar una foto</span>
              <span className="text-xs text-slate-400">JPG, JPEG o PNG</span>
            </>
          )}
        </button>

        <input ref={inputRef} type="file" accept={ACCEPT} onChange={handleFileChange} className="hidden" />

        {preview && (
          <button
            onClick={() => { setPreview(null); setFile(null); inputRef.current.value = '' }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-500 mb-3 transition-colors"
          >
            <X className="w-3 h-3" /> Cambiar imagen
          </button>
        )}

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <Button onClick={handleAnalyze} disabled={!file || loading}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Analizando…</span></>
            : <span>Ver resultados</span>
          }
        </Button>
      </Card>
    </main>
  )
}
