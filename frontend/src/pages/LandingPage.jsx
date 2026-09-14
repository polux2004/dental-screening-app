import { useNavigate } from 'react-router-dom'
import { Camera, ScanLine, ClipboardList, ChevronRight, Smile, ShieldCheck } from 'lucide-react'
import Button from '../components/ui/Button'

const features = [
  {
    icon: Camera,
    title: 'Análisis por foto',
    desc: 'Sube una foto dental desde tu teléfono y obtén resultados en segundos.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: ScanLine,
    title: 'Detección de caries',
    desc: 'Identifica indicios visuales en cinco ángulos dentales distintos.',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: ClipboardList,
    title: 'Resultado claro',
    desc: 'Visualiza las zonas detectadas y guarda el resultado para tu consulta.',
    color: 'bg-indigo-50 text-indigo-600',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── Hero split ─────────────────────────────────────────────────────── */}
      <section className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-[82vh]">

        {/* Texto */}
        <div className="flex flex-col justify-center px-8 py-16 md:px-14 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Screening dental{' '}
            <span className="text-gradient">inteligente</span>
          </h1>

          <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-sm">
            Detecta indicios de caries y gingivitis en fotografías dentales tomadas con tu smartphone.
            Rápido, simple y orientativo.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xs">
            <Button onClick={() => navigate('/seleccion')}>
              Comenzar análisis
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-slate-400 mt-6 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            No reemplaza el diagnóstico de un profesional de salud.
          </p>
        </div>

        {/* Panel decorativo */}
        <div className="hidden md:flex hero-panel items-center justify-center relative overflow-hidden">
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-28 h-28 rounded-3xl bg-white/70 backdrop-blur-sm shadow-xl border border-white flex items-center justify-center">
              <Smile className="w-14 h-14 text-indigo-500" strokeWidth={1.2} />
            </div>
            <div className="flex gap-4">
              {[Camera, ScanLine, ClipboardList].map((Icon, i) => (
                <div key={i} className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm shadow-md border border-white flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-500" strokeWidth={1.5} />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-500 bg-white/60 px-4 py-2 rounded-full border border-white/80">
              Diseñado para 10 a 24 años
            </p>
          </div>
        </div>
      </section>

      {/* ── Feature cards ──────────────────────────────────────────────────── */}
      <section className="bg-slate-50 border-t border-slate-100 px-6 py-12">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-8">
          Qué ofrecemos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-2xl mx-auto animate-slide-up">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title} className="bg-white rounded-2xl border border-slate-100 p-5 card-glow flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">{f.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="px-6 py-4 text-center border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Esta herramienta <strong className="text-slate-500">no reemplaza</strong> el diagnóstico de un profesional de salud.
        </p>
      </footer>
    </main>
  )
}
