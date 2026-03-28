"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Briefcase, ArrowLeft, Calendar, User, Target } from "lucide-react"

interface Consultoria {
  _id: string; codigo: string; tipo: string; normas: string[]; consultorLider?: string
  fechaInicio: string; fechaFinPlan: string; estado: string; avance: number
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
}

const ESTADO_COLORS: Record<string, string> = {
  'Activo': 'bg-blue-100 text-blue-800',
  'Completado': 'bg-green-100 text-green-800',
  'Propuesta': 'bg-slate-100 text-slate-600',
  'Pausado': 'bg-orange-100 text-orange-800',
  'Cancelado': 'bg-red-100 text-red-700',
}

export default function ConsultoriaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Consultoria | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        const found = data.consultorias?.find((c: Consultoria) => c._id === id)
        setItem(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!item) return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">Consultoría no encontrada</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal/consultoria" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <Briefcase className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-slate-800">Consultoría {item.codigo}</h2>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Avance</span>
          <span className="text-2xl font-bold text-purple-600">{item.avance}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 h-4 rounded-full" style={{ width: `${item.avance}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Briefcase, label: "Tipo", value: item.tipo },
          { icon: Target, label: "Normas", value: item.normas?.join(", ") || "—" },
          { icon: Calendar, label: "Período", value: `${formatDate(item.fechaInicio)} → ${formatDate(item.fechaFinPlan)}` },
          { icon: User, label: "Consultor Líder", value: item.consultorLider || "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <s.icon className="w-5 h-5 text-purple-600 mb-2" />
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-3">Estado</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${ESTADO_COLORS[item.estado] || 'bg-slate-100 text-slate-600'}`}>
          {item.estado}
        </span>
      </div>
    </div>
  )
}
