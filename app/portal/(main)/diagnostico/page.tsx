"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileSearch, ArrowLeft } from "lucide-react"

interface Diagnostico {
  _id: string; codigo: string; normas: string[]; estado: string; fechaVisita: string
  consultorAsignado?: string; cumplimientoGlobal?: number; viabilidad?: string
  tiempoEstimado?: number; resumenEjecutivo?: string
}

const ESTADO_COLORS: Record<string, string> = {
  'Completado': 'bg-green-100 text-green-800',
  'En ejecución': 'bg-blue-100 text-blue-800',
  'Programado': 'bg-amber-100 text-amber-800',
  'Cancelado': 'bg-red-100 text-red-700',
}

function Badge({ text }: { text: string }) {
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[text] || 'bg-slate-100 text-slate-600'}`}>{text}</span>
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
}

export default function DiagnosticoListPage() {
  const [items, setItems] = useState<Diagnostico[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setItems(data.diagnosticos || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <FileSearch className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-800">Mis Diagnósticos</h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">
          No tienes diagnósticos registrados.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((d) => (
            <Link key={d._id} href={`/portal/diagnostico/${d._id}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{d.codigo}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{d.normas?.join(", ")} — {formatDate(d.fechaVisita)}</p>
                  {d.consultorAsignado && <p className="text-xs text-slate-400 mt-1">Consultor: {d.consultorAsignado}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {d.cumplimientoGlobal != null && (
                    <div className="text-center">
                      <span className="text-lg font-bold text-blue-600">{d.cumplimientoGlobal}%</span>
                      <p className="text-xs text-slate-500">Cumplimiento</p>
                    </div>
                  )}
                  <Badge text={d.estado} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
