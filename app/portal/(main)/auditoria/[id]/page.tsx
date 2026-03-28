"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ClipboardCheck, ArrowLeft, Calendar, User, AlertTriangle, AlertCircle, Eye } from "lucide-react"

interface Auditoria {
  _id: string; codigo: string; tipo: string; normas: string[]; fechaInicio: string
  fechaFin: string; auditorLider?: string; estado: string; resultado?: string
  numNCMayores: number; numNCMenores: number; numObservaciones: number
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
}

export default function AuditoriaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Auditoria | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        const found = data.auditorias?.find((a: Auditoria) => a._id === id)
        setItem(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!item) return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">Auditoría no encontrada</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal/auditoria" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <ClipboardCheck className="w-6 h-6 text-amber-600" />
        <h2 className="text-xl font-bold text-slate-800">Auditoría {item.codigo}</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ClipboardCheck, label: "Tipo", value: item.tipo },
          { icon: Calendar, label: "Fechas", value: `${formatDate(item.fechaInicio)} — ${formatDate(item.fechaFin)}` },
          { icon: User, label: "Auditor Líder", value: item.auditorLider || "—" },
          { icon: Eye, label: "Resultado", value: item.resultado || "Pendiente" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <s.icon className="w-5 h-5 text-amber-600 mb-2" />
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Resumen de Hallazgos</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-700">{item.numNCMayores}</p>
            <p className="text-xs text-red-600">NC Mayores</p>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-xl">
            <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-700">{item.numNCMenores}</p>
            <p className="text-xs text-amber-600">NC Menores</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <Eye className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-700">{item.numObservaciones}</p>
            <p className="text-xs text-blue-600">Observaciones</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Normas Auditadas</h3>
        <div className="flex flex-wrap gap-2">
          {item.normas?.map((n) => (
            <span key={n} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{n}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
