import { useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, Camera, ClipboardCheck, Heart, Image, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react'

const steps = [
  { icon: Camera, number: '01', title: 'Elige un análisis', description: 'Consulta qué análisis están disponibles y qué tipo de imagen requiere cada uno.' },
  { icon: Image, number: '02', title: 'Revisamos la calidad', description: 'Comprobamos el brillo, la nitidez y el tamaño antes de procesarla.' },
  { icon: ScanSearch, number: '03', title: 'Explora el resultado', description: 'Observa los posibles hallazgos señalados directamente sobre la imagen.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const start = () => navigate('/seleccion')

  return (
    <main className="landing-page">
      <div className="landing-dark">
        <header className="landing-header landing-container">
          <a className="landing-brand" href="/" aria-label="Dental Screening, ir al inicio">
            <span className="landing-brand-icon"><Heart size={20} strokeWidth={2.4} /></span>
            <span><strong>Dental Screening</strong><small>Orientación dental visual</small></span>
          </a>
          <nav className="landing-nav" aria-label="Navegación principal">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#que-analiza">Qué analiza</a>
            <a href="#sobre-el-proyecto">Sobre el proyecto</a>
          </nav>
          <button className="landing-nav-cta" onClick={start}>Comenzar <ArrowRight size={15} /></button>
        </header>

        <section className="landing-hero landing-container" aria-labelledby="landing-title">
          <div className="landing-hero-copy">
            <span className="landing-eyebrow"><Sparkles size={15} /> Una forma más clara de observar</span>
            <h1 id="landing-title">Una nueva mirada a tu <span>salud dental.</span></h1>
            <p>Un espacio para explorar posibles indicios de caries y gingivitis en fotografías dentales. Elige el análisis y sube una imagen para comenzar.</p>
            <div className="landing-actions">
              <button className="landing-primary" onClick={start}>Comenzar análisis <ArrowRight size={18} /></button>
              <a className="landing-secondary" href="#como-funciona">Conoce el proceso</a>
            </div>
            <div className="landing-hero-note"><ShieldCheck size={20} /><span>Resultado orientativo. No reemplaza una evaluación odontológica.</span></div>
          </div>
          <div className="landing-hero-visual">
            <img src="/images/dental-check.png" alt="Dentista examinando los dientes de una paciente" className="landing-hero-image" />
            <div className="landing-photo-badge">
              <span className="landing-photo-badge-icon"><ScanSearch size={21} /></span>
              <span className="landing-photo-badge-status"><strong>Caries · disponible</strong><strong>Gingivitis · disponible</strong></span>
            </div>
          </div>
        </section>
      </div>

      <section className="landing-story landing-container" id="que-analiza" aria-labelledby="story-title">
        <div className="landing-story-visual">
          <img src="/images/dental-review.png" alt="Odontólogo mostrando una radiografía dental a una paciente" loading="lazy" />
          <span className="landing-story-tag"><ClipboardCheck size={17} /> Información para orientarte</span>
        </div>
        <div className="landing-story-copy">
          <span className="landing-section-label">CONOCE LA HERRAMIENTA</span>
          <h2 id="story-title">Dos áreas de análisis, una visión más completa.</h2>
          <p>Dental Screening explora la salud dental a partir de fotografías. Cada área tiene su propio estado de desarrollo, mostrado con claridad antes de comenzar.</p>
          <div className="landing-analysis-grid">
            <article className="landing-analysis-card">
              <ScanSearch size={21} aria-hidden="true" />
              <h3>Caries</h3>
              <p>Analiza fotos mandibulares o maxilares y señala posibles hallazgos sobre la imagen.</p>
              <span>Disponible</span>
            </article>
            <article className="landing-analysis-card">
              <Activity size={21} aria-hidden="true" />
              <h3>Gingivitis</h3>
              <p>Analiza una foto frontal y señala posibles hallazgos en las encías.</p>
              <span>Disponible</span>
            </article>
          </div>
          <button className="landing-text-link" onClick={start}>Explorar el análisis <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="landing-process" id="como-funciona" aria-labelledby="process-title">
        <div className="landing-container">
          <div className="landing-process-heading">
            <span className="landing-section-label">UN PROCESO SIMPLE</span>
            <h2 id="process-title">Tres pasos para comenzar</h2>
            <p>Una experiencia guiada desde la elección de la foto hasta la lectura del resultado.</p>
          </div>
          <div className="landing-steps">
            {steps.map(({ icon: Icon, number, title, description }, index) => (
              <article className={`landing-step ${index === 1 ? 'landing-step-featured' : ''}`} key={number}>
                <div className="landing-step-top"><span className="landing-step-icon"><Icon size={25} strokeWidth={1.8} /></span><span className="landing-step-number">{number}</span></div>
                <h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-end" id="sobre-el-proyecto">
        <div className="landing-container landing-end-inner">
          <div>
            <span className="landing-section-label">SOBRE EL PROYECTO</span>
            <h2>Tecnología para observar mejor, con responsabilidad.</h2>
            <p>Herramienta académica de apoyo visual para personas de 10 a 24 años. Los resultados son preliminares y siempre deben interpretarse con un profesional de salud.</p>
          </div>
          <button className="landing-primary" onClick={start}>Empezar ahora <ArrowRight size={18} /></button>
        </div>
      </section>

      <footer className="landing-footer"><div className="landing-container landing-footer-inner"><span>© Dental Screening</span><span>Un análisis orientativo no constituye un diagnóstico médico.</span></div></footer>
    </main>
  )
}
