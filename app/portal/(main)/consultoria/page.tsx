"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Briefcase, ArrowLeft } from "lucide-react"

interface Consultoria {
  _id: string; codigo: string; tipo: string; normas: string[]; consultorLider?: string
  fechaInicio: string; fechaFinPlan: string; estado: string; avance: number
}

const ESTADO_COLORS: Record<string, string> = {
  'Activo': 'bg-blue-100 text-blue-800',
  'Completado': 'bg-green-100 text-green-800',
  'Propuesta': 'bg-slate-100 text-slate-600',
  'Pausado': 'bg-orange-100 text-orange-800',
  'Cancelado': 'bg-red-100 text-red-700',
}

function Badge({ text }: { text: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[text] || 'bg-slate-100 text-slate-600'}`}>{text}</span>
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
}

export default function ConsultoriaListPage() {
  const [items, setItems] = useState<Consultoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setItems(data.consultorias || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <Briefcase className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-slate-800">Mis Consultorías</h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">No tienes consultorías registradas.</div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link key={c._id} href={`/portal/consultoria/${c._id}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{c.codigo}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{c.tipo} — {c.normas?.join(", ")}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(c.fechaInicio)} → {formatDate(c.fechaFinPlan)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20">
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${c.avance}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-0.5">{c.avance}%</p>
                  </div>
                  <Badge text={c.estado} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
