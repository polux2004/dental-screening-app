import { useNavigate } from 'react-router-dom'
import { Scan, Activity } from 'lucide-react'

const options = [
  {
    id: 'caries',
    available: true,
    icon: Scan,
    title: 'Caries',
    desc: 'Explora posibles caries en una fotografía mandibular o maxilar.',
    details: 'Foto mandibular o maxilar',
    status: 'Disponible',
    color: 'hover:border-teal-300 hover:bg-teal-50/40 cursor-pointer',
    iconBg: 'bg-teal-50 text-teal-500',
    badge: 'bg-teal-50 text-teal-600 border-teal-100',
  },
  {
    id: 'gingivitis',
    available: true,
    icon: Activity,
    title: 'Gingivitis',
    desc: 'Explora posibles indicios de gingivitis en una fotografía de dientes y encías.',
    details: 'Solo foto frontal',
    status: 'Disponible',
    color: 'hover:border-cyan-300 hover:bg-cyan-50/40 cursor-pointer',
    iconBg: 'bg-cyan-50 text-cyan-500',
    badge: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  },
]

export default function SelectionPage() {
  const navigate = useNavigate()

  function handleSelect(analysisType) {
    navigate(`/captura?analysis=${analysisType}`)
  }

  return (
    <main className="min-h-screen page-bg flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <p className="text-xs font-semibold text-teal-400 uppercase tracking-wide mb-1">Paso 1</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">¿Qué deseas analizar?</h1>
        <p className="text-sm text-slate-500 mb-7">
          Caries y gingivitis forman parte del proyecto. Consulta el estado de cada análisis antes de continuar.
        </p>

        <div className="flex flex-col gap-3">
          {options.map((opt) => {
            const Icon = opt.icon
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={!opt.available}
                className={`w-full min-h-40 text-left bg-white border-2 border-slate-100 rounded-2xl p-5 card-glow transition-all duration-200 ${opt.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${opt.iconBg}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-slate-900">{opt.title}</p>
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full border ${opt.badge}`}>{opt.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{opt.desc}</p>
                    <p className="text-xs font-medium text-slate-600">{opt.details}</p>
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
