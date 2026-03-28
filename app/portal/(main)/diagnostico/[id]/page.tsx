"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { FileSearch, ArrowLeft, Calendar, User, BarChart3, Clock, Target } from "lucide-react"

interface Diagnostico {
  _id: string; codigo: string; normas: string[]; estado: string; fechaVisita: string
  consultorAsignado?: string; cumplimientoGlobal?: number; viabilidad?: string
  tiempoEstimado?: number; inversionEstimada?: number; resumenEjecutivo?: string
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
}

export default function DiagnosticoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Diagnostico | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        const found = data.diagnosticos?.find((d: Diagnostico) => d._id === id)
        setItem(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!item) return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">Diagnóstico no encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal/diagnostico" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <FileSearch className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-800">Diagnóstico {item.codigo}</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Fecha de Visita", value: formatDate(item.fechaVisita) },
          { icon: User, label: "Consultor", value: item.consultorAsignado || "—" },
          { icon: BarChart3, label: "Cumplimiento", value: item.cumplimientoGlobal != null ? `${item.cumplimientoGlobal}%` : "—" },
          { icon: Target, label: "Viabilidad", value: item.viabilidad || "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <s.icon className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-lg font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-3">Detalles</h3>
          <dl className="space-y-3 text-sm">
            <div><dt className="text-slate-500">Normas</dt><dd className="font-medium text-slate-800">{item.normas?.join(", ") || "—"}</dd></div>
            <div><dt className="text-slate-500">Estado</dt><dd><span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.estado === 'Completado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{item.estado}</span></dd></div>
            {item.tiempoEstimado && <div><dt className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Tiempo Estimado</dt><dd className="font-medium text-slate-800">{item.tiempoEstimado} meses</dd></div>}
          </dl>
        </div>

        {item.resumenEjecutivo && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Resumen Ejecutivo</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{item.resumenEjecutivo}</p>
          </div>
        )}
      </div>
    </div>
  )
}
