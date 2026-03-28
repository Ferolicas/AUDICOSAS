"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Award, ArrowLeft, Calendar, User, Target, CheckCircle2, Circle } from "lucide-react"

interface Fase {
  numero: number; nombre: string; avance: number
  tareas?: { nombre: string; completada: boolean }[]
  entregables?: { nombre: string; completado: boolean }[]
}

interface Certificacion {
  _id: string; codigo: string; normas: string[]; faseActual: number; avanceGlobal: number
  consultorLider?: string; fechaInicio: string; fechaObjetivo: string; estado: string
  prioridad?: string; fases?: Fase[]
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
}

export default function CertificacionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<Certificacion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        const found = data.certificaciones?.find((c: Certificacion) => c._id === id)
        setItem(found || null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
  if (!item) return <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">Certificación no encontrada</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal/certificacion" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <Award className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-slate-800">Certificación {item.codigo}</h2>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600">Avance Global</span>
          <span className="text-2xl font-bold text-blue-600">{item.avanceGlobal}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4">
          <div className="bg-gradient-to-r from-blue-600 to-green-500 h-4 rounded-full transition-all" style={{ width: `${item.avanceGlobal}%` }} />
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: "Normas", value: item.normas?.join(", ") || "—" },
          { icon: Calendar, label: "Inicio", value: formatDate(item.fechaInicio) },
          { icon: Calendar, label: "Meta", value: formatDate(item.fechaObjetivo) },
          { icon: User, label: "Consultor Líder", value: item.consultorLider || "—" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <s.icon className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Phases */}
      {item.fases && item.fases.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800 text-lg">Fases del Proyecto</h3>
          {item.fases.map((fase, idx) => {
            const isCurrent = fase.numero === item.faseActual
            return (
              <div key={idx} className={`bg-white rounded-xl border ${isCurrent ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200'} p-5 shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      fase.avance === 100 ? 'bg-green-100 text-green-700' : isCurrent ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>{fase.numero}</span>
                    <span className="font-medium text-slate-800">{fase.nombre}</span>
                    {isCurrent && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Actual</span>}
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{fase.avance}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-3">
                  <div className={`h-2 rounded-full ${fase.avance === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${fase.avance}%` }} />
                </div>

                {/* Tasks */}
                {fase.tareas && fase.tareas.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Tareas</p>
                    <ul className="space-y-1.5">
                      {fase.tareas.map((t, ti) => (
                        <li key={ti} className="flex items-center gap-2 text-sm">
                          {t.completada ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
                          <span className={t.completada ? 'text-slate-500 line-through' : 'text-slate-700'}>{t.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deliverables */}
                {fase.entregables && fase.entregables.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Entregables</p>
                    <ul className="space-y-1.5">
                      {fase.entregables.map((e, ei) => (
                        <li key={ei} className="flex items-center gap-2 text-sm">
                          {e.completado ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
                          <span className={e.completado ? 'text-slate-500 line-through' : 'text-slate-700'}>{e.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
