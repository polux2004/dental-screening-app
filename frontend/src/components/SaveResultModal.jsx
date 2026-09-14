import { useState } from 'react'
import { saveResult } from '../services/api'
import { CheckCircle2, X, Loader2 } from 'lucide-react'
import Button from './ui/Button'

export default function SaveResultModal({ result, onClose }) {
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      await saveResult(result.id ?? 0, notes || null)
      setSaved(true)
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-sm p-6 animate-slide-up">
        {saved ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-slate-800">Resultado guardado correctamente.</p>
            <Button onClick={onClose} className="mt-1">Cerrar</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Guardar resultado</h2>
              <button onClick={onClose} disabled={saving} className="text-slate-300 hover:text-slate-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">Agrega una nota opcional antes de guardar.</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              placeholder="Nota (opcional)"
              rows={3}
              className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 text-slate-800 placeholder:text-slate-300 mb-3"
            />
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <div className="flex flex-col gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Guardando…</span></>
                  : <span>Guardar</span>
                }
              </Button>
              <Button variant="ghost" onClick={onClose} disabled={saving}>Cancelar</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
