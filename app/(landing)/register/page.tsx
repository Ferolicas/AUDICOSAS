"use client"
import { useState } from 'react'

export default function RegisterPage(){
  const [status, setStatus] = useState<string|undefined>()
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setLoading(true)
    setStatus(undefined)
    try{
      const res = await fetch('/api/clients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json = await res.json()
      if(!res.ok) throw new Error(json?.error || 'Error')
      setStatus('¡Registro exitoso! Te contactaremos en breve.')
      form.reset()
    }catch(err:any){ setStatus('Error: ' + err.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Regístrate para una consultoría</h1>
      <p className="mt-2 text-slate-600">Déjanos tus datos y un experto se pondrá en contacto.</p>
      <form onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-4">
        <input name="name" required placeholder="Nombre completo" className="px-4 py-3 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <input name="email" type="email" required placeholder="Correo electrónico" className="px-4 py-3 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <input name="phone" placeholder="Teléfono / WhatsApp" className="px-4 py-3 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <input name="company" placeholder="Empresa" className="px-4 py-3 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <input name="serviceInterest" placeholder="Interés (ISO 9001 / SIG / Proyectos / Web / etc.)" className="px-4 py-3 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <textarea name="message" placeholder="Cuéntanos tu necesidad" className="px-4 py-3 rounded-md bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} />
        <label className="text-sm text-slate-500 flex items-center gap-2"><input type="checkbox" name="subscribe" value="true" defaultChecked className="accent-amber-600" /> Quiero recibir boletines</label>
        <button disabled={loading} className="px-5 py-3 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-sm">{loading ? 'Enviando...' : 'Enviar'}</button>
      </form>
      {status && <div className="mt-4 text-sm text-slate-700">{status}</div>}
      <div className="mt-6 text-xs text-slate-500">La información será tratada conforme a la Ley 1581 de 2012 (protección de datos personales).</div>
    </div>
  )
}
