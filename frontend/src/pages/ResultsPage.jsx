import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ScanLine, Home, CheckCircle, AlertCircle, Scan } from 'lucide-react'
import BoundingBoxOverlay from '../components/BoundingBoxOverlay'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const DIAGNOSIS_LABEL = {
  ninguna:    'Sin hallazgos',
  caries:     'Caries detectada',
}

const DIAGNOSIS_STYLE = {
  ninguna:    { chip: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle },
  caries:     { chip: 'bg-red-50 text-red-700 border-red-100',            icon: AlertCircle },
}

function ResultPanel({ title, icon: Icon, iconStyle, result, imageUrl }) {
  const style = DIAGNOSIS_STYLE[result.diagnosis] ?? DIAGNOSIS_STYLE.ninguna
  const DiagIcon = style.icon

  return (
    <div className="flex flex-col gap-3">
      {/* Header de panel */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${iconStyle.bg} ${iconStyle.border}`}>
        <Icon className={`w-4 h-4 ${iconStyle.text}`} strokeWidth={1.8} />
        <p className={`text-xs font-bold uppercase tracking-wide ${iconStyle.text}`}>{title}</p>
      </div>

      {/* Imagen con bounding boxes */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900/5 border border-slate-100">
        {imageUrl && <img src={imageUrl} alt={`Foto ${title}`} className="w-full object-contain" />}
        <BoundingBoxOverlay
          boxes={result.boxes}
          imageWidth={result.image_width}
          imageHeight={result.image_height}
        />
      </div>

      {/* Chip diagnóstico */}
      <div className={`inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border text-sm font-semibold ${style.chip}`}>
        <DiagIcon className="w-3.5 h-3.5" strokeWidth={2} />
        {DIAGNOSIS_LABEL[result.diagnosis] ?? result.diagnosis}
      </div>

      <p className="text-xs text-slate-400">
        Foto: <span className="font-medium text-slate-600">{result.photo_type}</span>
      </p>
    </div>
  )
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  if (!state?.result) return <Navigate to="/" replace />

  const { result, imageUrl } = state

  return (
    <main className="min-h-screen page-bg flex flex-col items-center p-4 gap-4 animate-fade-in">
      <Card className="w-full max-w-lg">

        <div className="flex items-center gap-2 mb-1">
          <ScanLine className="w-4 h-4 text-teal-400" strokeWidth={1.5} />
          <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide">Resultado del análisis</p>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-6">
          Caries
        </h1>

        <div className="mb-6">
          <ResultPanel
            title="Caries"
            icon={Scan}
            iconStyle={{ bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-600' }}
            result={result}
            imageUrl={imageUrl}
          />
        </div>

        <p className="text-xs text-slate-400 mb-5">
          Resultado orientativo. No constituye diagnóstico médico.
        </p>

        <div className="flex flex-col gap-2">
          <Button onClick={() => navigate('/seleccion')}>
            <ScanLine className="w-4 h-4" />
            Nuevo análisis
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="w-4 h-4" />
            Terminar
          </Button>
        </div>
      </Card>

    </main>
  )
}
