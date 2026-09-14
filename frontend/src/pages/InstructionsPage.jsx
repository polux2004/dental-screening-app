import { useNavigate } from 'react-router-dom'
import { Lightbulb, Aperture, Ruler, Focus, Tag, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const steps = [
  { icon: Lightbulb, text: 'Busca un lugar bien iluminado, preferiblemente con luz natural.' },
  { icon: Aperture,  text: 'Abre bien la boca y muestra los dientes que deseas fotografiar.' },
  { icon: Ruler,     text: 'Mantén el teléfono firme a unos 15–20 cm de distancia.' },
  { icon: Focus,     text: 'Asegúrate de que la imagen salga nítida y bien encuadrada.' },
  { icon: Tag,       text: 'Selecciona el tipo de foto antes de subir la imagen.' },
]

const angles = [
  { label: 'Frontal',    key: 'frontal',    note: 'Gingivitis' },
  { label: 'Mandibular', key: 'mandibular', note: 'Caries' },
  { label: 'Maxilar',    key: 'maxilar',    note: 'Caries' },
]

export default function InstructionsPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen page-bg flex flex-col items-center p-4 gap-4 animate-fade-in">

      <Card className="w-full max-w-md">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Paso a paso</p>
        <h1 className="text-xl font-bold text-slate-900 mb-5">Instrucciones de captura</h1>
        <ol className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <li key={i} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <div className="flex gap-2 items-start pt-0.5">
                  <Icon className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-sm text-slate-600">{step.text}</span>
                </div>
              </li>
            )
          })}
        </ol>
      </Card>

      <Card className="w-full max-w-md">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Guía visual</p>
        <h2 className="text-base font-bold text-slate-900 mb-4">Ángulos para fotografiar</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {angles.map((a) => (
            <div key={a.key} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-square rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                <span className="text-xs text-slate-400 text-center px-2">{a.label.toLowerCase()}</span>
              </div>
              <span className="text-xs font-medium text-slate-600">{a.label}</span>
              <span className="text-xs text-indigo-400">{a.note}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="w-full max-w-md">
        <Button onClick={() => navigate('/captura')}>
          Entendido, subir foto
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </main>
  )
}
