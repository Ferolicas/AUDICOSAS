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
      setTimeout(() => { setOpen(false); setStatus(undefined) }, 2500)
    } catch (err: any) { setStatus('Error: ' + err.message) }
    finally { setLoading(false) }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-[modalIn_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-4" style={{ background: 'linear-gradient(135deg, #1B2A4A, #2563EB)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Agenda tu consultoría</h2>
              <p className="text-blue-200 text-sm mt-1">Sin costo. Un experto te contactará.</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors text-2xl leading-none font-light h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Success state */}
        {status === 'success' ? (
          <div className="px-8 py-12 text-center">
            <div className="text-5xl mb-4">&#10003;</div>
            <h3 className="text-xl font-bold text-slate-900">Registro exitoso</h3>
            <p className="text-slate-600 mt-2">Te contactaremos en breve.</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={onSubmit} className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
                <input name="name" required placeholder="Tu nombre completo" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Empresa</label>
                <input name="company" placeholder="Tu empresa" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Correo</label>
                <input name="email" type="email" required placeholder="correo@empresa.com" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">WhatsApp</label>
                <input name="phone" placeholder="+57 3XX XXX XXXX" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Servicio de interés</label>
              <select name="serviceInterest" className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                <option value="">Selecciona un servicio</option>
                <option value="ISO 9001">Auditoría ISO 9001</option>
                <option value="ISO 14001">Auditoría ISO 14001</option>
                <option value="ISO 45001">Auditoría ISO 45001</option>
                <option value="SIG">Sistemas Integrados de Gestión</option>
                <option value="Gestión Empresarial">Gestión Empresarial</option>
                <option value="Proyectos">Formulación de Proyectos</option>
                <option value="Mercadeo">Mercadeo y Ventas</option>
                <option value="Web + SEO">Web + SEO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Mensaje</label>
              <textarea name="message" placeholder="Cuéntanos brevemente tu necesidad..." className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" rows={3} />
            </div>
            <label className="text-xs text-slate-500 flex items-center gap-2">
              <input type="checkbox" name="subscribe" value="true" defaultChecked className="accent-amber-600 rounded" /> Quiero recibir boletines informativos
            </label>

            {status && status !== 'success' && (
              <div className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{status}</div>
            )}

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-sm text-sm disabled:opacity-60"
            >
              {loading ? 'Enviando...' : 'Solicitar consultoría gratuita'}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Tus datos están protegidos conforme a la Ley 1581 de 2012.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
