"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { GraduationCap, ArrowLeft, Calendar, Clock, Users } from "lucide-react"

interface Capacitacion {
  _id: string; codigo: string; cursoNombre: string; tipo: string; instructor?: string
  fecha: string; duracionHoras: number; modalidad?: string; numParticipantes?: number; estado: string
}

const ESTADO_COLORS: Record<string, string> = {
  'Ejecutada': 'bg-green-100 text-green-800',
  'Programada': 'bg-amber-100 text-amber-800',
  'Cancelada': 'bg-red-100 text-red-700',
}

function Badge({ text }: { text: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[text] || 'bg-slate-100 text-slate-600'}`}>{text}</span>
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
}

export default function CapacitacionesListPage() {
  const [items, setItems] = useState<Capacitacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setItems(data.capacitaciones || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <GraduationCap className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-bold text-slate-800">Mis Capacitaciones</h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">No tienes capacitaciones registradas.</div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link key={c._id} href={`/portal/capacitaciones/${c._id}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{c.cursoNombre}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{c.tipo}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(c.fecha)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duracionHoras}h</span>
                    {c.modalidad && <span>{c.modalidad}</span>}
                    {c.numParticipantes && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.numParticipantes}</span>}
                  </div>
                </div>
                <Badge text={c.estado} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
