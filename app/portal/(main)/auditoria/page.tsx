"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ClipboardCheck, ArrowLeft } from "lucide-react"

interface Auditoria {
  _id: string; codigo: string; tipo: string; normas: string[]; fechaInicio: string
  fechaFin: string; auditorLider?: string; estado: string; resultado?: string
  numNCMayores: number; numNCMenores: number; numObservaciones: number
}

const ESTADO_COLORS: Record<string, string> = {
  'Completada': 'bg-green-100 text-green-800',
  'En ejecución': 'bg-blue-100 text-blue-800',
  'Planificada': 'bg-amber-100 text-amber-800',
  'Cancelada': 'bg-red-100 text-red-700',
  'Conforme': 'bg-green-100 text-green-800',
  'No conforme': 'bg-red-100 text-red-700',
  'Conforme con observaciones': 'bg-amber-100 text-amber-800',
}

function Badge({ text }: { text: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[text] || 'bg-slate-100 text-slate-600'}`}>{text}</span>
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
}

export default function AuditoriaListPage() {
  const [items, setItems] = useState<Auditoria[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setItems(data.auditorias || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <ClipboardCheck className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-bold text-slate-800">Mis Auditorías</h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">No tienes auditorías registradas.</div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Link key={a._id} href={`/portal/auditoria/${a._id}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{a.codigo}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{a.tipo}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(a.fechaInicio)} — {formatDate(a.fechaFin)}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {a.resultado && <Badge text={a.resultado} />}
                  <Badge text={a.estado} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
