"use client"
import { useEffect, useState } from 'react'

type Client = { _id: string; name: string; email: string; phone?: string; company?: string; serviceInterest?: string; _createdAt?: string }

export default function AdminPage(){
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|undefined>()
  const [newsStatus, setNewsStatus] = useState<string|undefined>()

  async function load(){
    try{
      setLoading(true)
      const res = await fetch('/api/clients', { cache: 'no-store' })
      const json = await res.json()
      if(!res.ok) throw new Error(json?.error || 'Error')
      setClients(json.clients)
    }catch(e:any){ setError(e.message) } finally{ setLoading(false) }
  }

  useEffect(()=>{ load() },[])

  async function sendNewsletter(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setNewsStatus(undefined)
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as any
    const res = await fetch('/api/newsletters', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ title: data.title, content: data.content, recipients: 'all' }) })
    const json = await res.json()
    setNewsStatus(res.ok ? 'Boletín procesado: ' + (json.status || 'ok') : 'Error: ' + (json.error || ''))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Panel Administrativo</h1>
      <p className="text-slate-300 mt-2">Gestiona clientes, procesos y boletines.</p>

      <section className="mt-8">
        <div className="text-xl font-medium">Clientes recientes</div>
        {loading ? <div className="mt-4">Cargando...</div> : error ? <div className="mt-4 text-red-400">{error}</div> : (
          <div className="mt-4 overflow-auto border border-slate-800 rounded">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/40">
                <tr>
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Teléfono</th>
                  <th className="text-left p-3">Empresa</th>
                  <th className="text-left p-3">Interés</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c._id} className="border-t border-slate-800">
                    <td className="p-3">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone || '-'}</td>
                    <td className="p-3">{c.company || '-'}</td>
                    <td className="p-3">{c.serviceInterest || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="text-xl font-medium">Enviar Newsletter</div>
        <form onSubmit={sendNewsletter} className="mt-4 grid gap-3 max-w-2xl">
          <input name="title" required placeholder="Asunto / Título" className="px-4 py-3 rounded bg-slate-900 border border-slate-800" />
          <textarea name="content" required rows={6} placeholder="Contenido HTML o texto" className="px-4 py-3 rounded bg-slate-900 border border-slate-800" />
          <button className="px-5 py-3 rounded bg-primary text-black font-semibold">Enviar a todos</button>
          {newsStatus && <div className="text-sm">{newsStatus}</div>}
          <div className="text-xs text-slate-500">Nota: Si SMTP no está configurado, se registrará el boletín en Sanity y podrás enviarlo después.</div>
        </form>
      </section>
    </div>
  )
}

