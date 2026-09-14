import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function DisclaimerPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen page-bg flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">Antes de continuar</p>
            <h1 className="text-lg font-bold text-slate-900">Aviso importante</h1>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Esta aplicación realiza un <strong className="text-indigo-700">screening preliminar</strong> de
            posibles indicios de caries en fotografías dentales.{' '}
            <strong className="text-slate-700">No reemplaza el diagnóstico de un profesional de salud.</strong>{' '}
            Ante cualquier hallazgo, consulta a tu odontólogo.
          </p>
        </div>

        <Button onClick={() => navigate('/instrucciones')}>
          Entendido, continuar
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Card>
    </main>
  )
}
