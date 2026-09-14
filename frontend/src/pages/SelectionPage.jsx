import { useNavigate } from 'react-router-dom'
import { Scan, Activity } from 'lucide-react'
import Card from '../components/ui/Card'

const options = [
  {
    id: 'caries',
    icon: Scan,
    title: 'Caries',
    desc: 'Análisis de posibles caries. Necesitarás una foto mandibular o maxilar.',
    photos: 'Foto requerida: mandibular o maxilar',
    color: 'hover:border-indigo-300 hover:bg-indigo-50/40',
    iconBg: 'bg-indigo-50 text-indigo-500',
    badge: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
  {
    id: 'gingivitis',
    icon: Activity,
    title: 'Gingivitis',
    desc: 'Análisis de posibles indicios de gingivitis. Necesitarás una foto frontal.',
    photos: 'Foto requerida: frontal',
    color: 'hover:border-cyan-300 hover:bg-cyan-50/40',
    iconBg: 'bg-cyan-50 text-cyan-500',
    badge: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  },
]

export default function SelectionPage() {
  const navigate = useNavigate()

  function handleSelect(analysisType) {
    const firstDisease = analysisType === 'gingivitis' ? 'gingivitis' : 'caries'
    navigate('/captura', {
      state: {
        analysisType,
        currentDisease: firstDisease,
        previousResults: {},
      },
    })
  }

  return (
    <main className="min-h-screen page-bg flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Paso 1</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">¿Qué deseas analizar?</h1>
        <p className="text-sm text-slate-500 mb-7">
          Selecciona la enfermedad que quieres detectar. Esto determinará qué fotos debes tomar.
        </p>

        <div className="flex flex-col gap-3">
          {options.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left bg-white border-2 border-slate-100 rounded-2xl p-5 card-glow transition-all duration-200 ${opt.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.iconBg}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 mb-0.5">{opt.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{opt.desc}</p>
                    <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${opt.badge}`}>
                      {opt.photos}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-xs text-slate-400 text-center mt-6">
          Esta herramienta <strong className="text-slate-500">no reemplaza</strong> el diagnóstico de un profesional de salud.
        </p>
      </div>
    </main>
  )
}
