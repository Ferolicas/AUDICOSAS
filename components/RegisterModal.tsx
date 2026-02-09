"use client"
import { useState, useEffect } from 'react'
import { useModal } from './ModalContext'

export default function RegisterModal() {
  const { open, setOpen } = useModal()
  const [status, setStatus] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setLoading(true)
    setStatus(undefined)
    try {
      const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Error')
      setStatus('success')
      form.reset()
      setTimeout(() => { setOpen(false); setStatus(undefined) }, 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setStatus('Error: ' + message)
    } finally { setLoading(false) }
  }

  if (!open) return null

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
  const labelClass = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5"

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[modalIn_0.3s_ease-out] max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 pt-7 pb-5 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1B2A4A, #2563EB)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full mb-2">
                VALOR: $1,500 USD &mdash; HOY GRATIS
              </div>
              <h2 className="text-xl font-bold text-white">Solicita tu Diagnostico Gratuito</h2>
              <p className="text-blue-200 text-sm mt-1">Sin compromiso. Un experto visitara tu empresa.</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors text-2xl leading-none font-light h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 flex-shrink-0"
            >
              &times;
            </button>
          </div>
        </div>

        {status === 'success' ? (
          <div className="px-8 py-12 text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Solicitud Recibida</h3>
            <p className="text-slate-600 mt-2">Te contactaremos en las proximas 24 horas para agendar tu diagnostico.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="px-8 py-5 space-y-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre completo *</label>
                <input name="name" required placeholder="Tu nombre" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Empresa *</label>
                <input name="company" required placeholder="Nombre de tu empresa" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Correo *</label>
                <input name="email" type="email" required placeholder="correo@empresa.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp *</label>
                <input name="phone" required placeholder="+57 3XX XXX XXXX" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>No. Empleados</label>
                <select name="employees" className={inputClass}>
                  <option value="">Selecciona</option>
                  <option value="1-10">1 - 10</option>
                  <option value="11-25">11 - 25</option>
                  <option value="26-50">26 - 50</option>
                  <option value="51-100">51 - 100</option>
                  <option value="100+">100+</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Sector / Industria</label>
                <input name="sector" placeholder="Ej: Manufactura" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Certificacion de interes</label>
              <select name="serviceInterest" className={inputClass}>
                <option value="">Selecciona</option>
                <optgroup label="Certificaciones ISO">
                  <option value="ISO 9001 (Calidad)">ISO 9001 (Calidad)</option>
                  <option value="ISO 14001 (Ambiental)">ISO 14001 (Ambiental)</option>
                  <option value="ISO 45001 (SST)">ISO 45001 (Seguridad y Salud)</option>
                  <option value="Ambas (9001 + 14001)">Ambas (9001 + 14001)</option>
                  <option value="Sistema Integrado">Sistema Integrado (9001 + 14001 + 45001)</option>
                </optgroup>
                <optgroup label="Otros servicios">
                  <option value="Gestion Empresarial">Gestion Empresarial</option>
                  <option value="Proyectos">Formulacion de Proyectos</option>
                  <option value="Mercadeo y Ventas">Mercadeo y Ventas</option>
                  <option value="Web + SEO">Web + SEO</option>
                  <option value="No estoy seguro">No estoy seguro</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label className={labelClass}>Mensaje (opcional)</label>
              <textarea name="message" placeholder="Cuentanos brevemente tu situacion o necesidad..." className={inputClass} rows={2} />
            </div>

            <label className="text-xs text-slate-500 flex items-start gap-2">
              <input type="checkbox" name="privacy" required className="accent-blue-600 rounded mt-0.5" />
              <span>Acepto la politica de privacidad y tratamiento de datos conforme a la Ley 1581 de 2012 *</span>
            </label>
            <label className="text-xs text-slate-500 flex items-center gap-2">
              <input type="checkbox" name="subscribe" value="true" defaultChecked className="accent-amber-600 rounded" />
              Quiero recibir boletines informativos
            </label>

            {status && status !== 'success' && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{status}</div>
            )}

            <button
              disabled={loading}
              className="w-full py-3.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all shadow-lg hover:shadow-xl text-sm disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Enviando...' : 'SOLICITAR MI DIAGNOSTICO GRATUITO'}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Datos protegidos
              </span>
              <span>|</span>
              <span>Sin compromiso</span>
              <span>|</span>
              <span>100% confidencial</span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
