"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { GraduationCap, ArrowLeft, Calendar, Clock, Users, User, MapPin } from "lucide-react"

interface Capacitacion {
  _id: string; codigo: string; cursoNombre: string; tipo: string; instructor?: string
  fecha: string; duracionHoras: number; modalidad?: string; numParticipantes?: number; estado: string
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
}

const ESTADO_COLORS: Record<string, string> = {
  'Ejecutada': 'bg-green-100 text-green-800',
  'Programada': 'bg-amber-100 text-amber-800',
  'Cancelada': 'bg-red-100 text-red-700',
}

export default function CapacitacionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Capacitacion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        const found = data.capacitaciones?.find((c: Capacitacion) => c._id === id)
        setItem(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!item) return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">Capacitación no encontrada</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal/capacitaciones" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <GraduationCap className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-bold text-slate-800">{item.cursoNombre}</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: GraduationCap, label: "Tipo", value: item.tipo },
          { icon: Calendar, label: "Fecha", value: formatDate(item.fecha) },
          { icon: Clock, label: "Duración", value: `${item.duracionHoras} horas` },
          { icon: User, label: "Instructor", value: item.instructor || "—" },
          { icon: MapPin, label: "Modalidad", value: item.modalidad || "—" },
          { icon: Users, label: "Participantes", value: item.numParticipantes ? `${item.numParticipantes}` : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <s.icon className="w-5 h-5 text-teal-600 mb-2" />
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
