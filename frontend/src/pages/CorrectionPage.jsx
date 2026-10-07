import { useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function CorrectionPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const suggestions = state?.suggestions ?? ['Verifica la iluminación e intenta de nuevo.']
  const analysisType = state?.analysisType === 'gingivitis' ? 'gingivitis' : 'caries'

  return (
    <main className="min-h-screen page-bg flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Atención</p>
            <h1 className="text-lg font-bold text-slate-900">Foto no válida</h1>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          La imagen no cumple los requisitos de calidad. Por favor corrige lo siguiente:
        </p>

        <ul className="space-y-2 mb-6">
          {suggestions.map((s, i) => (
            <li key={i} className="flex gap-2 items-start text-sm text-slate-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
              {s}
            </li>
          ))}
        </ul>

        <Button onClick={() => navigate(`/captura?analysis=${analysisType}`)}>
          <RotateCcw className="w-4 h-4" />
          Volver a intentar
        </Button>
      </Card>
    </main>
  )
}
