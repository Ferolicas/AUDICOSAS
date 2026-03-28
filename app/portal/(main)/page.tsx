"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FileSearch, Award, ClipboardCheck, Briefcase, GraduationCap,
  Building2, TrendingUp, Calendar, ArrowRight,
} from "lucide-react"

interface PortalData {
  empresa: {
    razonSocial: string
    nombreComercial: string
    sector: string
    tamano: string
    numEmpleados: number
    estado: string
    consultorAsignado?: string
  } | null
  diagnosticos: { _id: string; codigo: string; estado: string; fechaVisita: string; normas: string[]; cumplimientoGlobal?: number }[]
  certificaciones: { _id: string; codigo: string; estado: string; avanceGlobal: number; normas: string[]; faseActual: number; fechaObjetivo: string }[]
  auditorias: { _id: string; codigo: string; estado: string; tipo: string; fechaInicio: string; resultado?: string }[]
  consultorias: { _id: string; codigo: string; estado: string; tipo: string; avance: number }[]
  capacitaciones: { _id: string; codigo: string; cursoNombre: string; estado: string; fecha: string }[]
}

const ESTADO_COLORS: Record<string, string> = {
  'Completado': 'bg-green-100 text-green-800',
  'Completada': 'bg-green-100 text-green-800',
  'Ejecutada': 'bg-green-100 text-green-800',
  'Activo': 'bg-blue-100 text-blue-800',
  'En ejecución': 'bg-blue-100 text-blue-800',
  'Programado': 'bg-amber-100 text-amber-800',
  'Programada': 'bg-amber-100 text-amber-800',
  'Planificada': 'bg-amber-100 text-amber-800',
  'Propuesta': 'bg-slate-100 text-slate-700',
  'Pausado': 'bg-orange-100 text-orange-800',
  'Cancelado': 'bg-red-100 text-red-700',
  'Cancelada': 'bg-red-100 text-red-700',
}

function Badge({ text }: { text: string }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ESTADO_COLORS[text] || 'bg-slate-100 text-slate-600'}`}>
      {text}
    </span>
  )
}

function formatDate(d: string) {
  if (!d) return "—"
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
}

export default function PortalDashboard() {
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject("Error"))
      .then(setData)
      .catch(() => setError("No se pudieron cargar tus datos"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        {error || "Error inesperado"}
      </div>
    )
  }

  const { empresa, diagnosticos, certificaciones, auditorias, consultorias, capacitaciones } = data

  const activeCert = certificaciones.find((c) => c.estado === "Activo")

  const sections = [
    { key: "diagnosticos", label: "Diagnósticos", icon: FileSearch, count: diagnosticos.length, href: "/portal/diagnostico", color: "blue" },
    { key: "certificaciones", label: "Certificaciones", icon: Award, count: certificaciones.length, href: "/portal/certificacion", color: "green" },
    { key: "auditorias", label: "Auditorías", icon: ClipboardCheck, count: auditorias.length, href: "/portal/auditoria", color: "amber" },
    { key: "consultorias", label: "Consultorías", icon: Briefcase, count: consultorias.length, href: "/portal/consultoria", color: "purple" },
    { key: "capacitaciones", label: "Capacitaciones", icon: GraduationCap, count: capacitaciones.length, href: "/portal/capacitaciones", color: "teal" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-[#0F1B33] to-[#2563EB] rounded-2xl p-6 lg:p-8 text-white">
        <h2 className="text-2xl lg:text-3xl font-bold !text-white">
          Bienvenido, {empresa?.nombreComercial || empresa?.razonSocial}
        </h2>
        <p className="mt-2 text-blue-200 text-sm lg:text-base">
          Aquí puedes consultar el estado de todos tus procesos con AUDICO.
        </p>
        {empresa?.consultorAsignado && (
          <p className="mt-3 text-blue-100 text-sm">
            Consultor asignado: <strong className="text-white">{empresa.consultorAsignado}</strong>
          </p>
        )}
      </div>

      {/* Active certification progress */}
      {activeCert && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-slate-800">Certificación en Progreso</h3>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-1">
                {activeCert.normas?.join(", ")} — Fase {activeCert.faseActual} de 6
              </p>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-green-500 h-3 rounded-full transition-all"
                  style={{ width: `${activeCert.avanceGlobal}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-slate-500">Avance: {activeCert.avanceGlobal}%</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Meta: {formatDate(activeCert.fechaObjetivo)}
                </span>
              </div>
            </div>
            <Link
              href={`/portal/certificacion/${activeCert._id}`}
              className="shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              Ver detalle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Service cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.key}
              href={s.href}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Icon className="w-8 h-8 text-blue-600 mb-3" />
              <div className="text-2xl font-bold text-slate-800">{s.count}</div>
              <div className="text-sm text-slate-500 mt-0.5">{s.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Company info */}
      {empresa && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Información de Mi Empresa</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Razón Social</p>
              <p className="font-medium text-slate-800">{empresa.razonSocial}</p>
            </div>
            <div>
              <p className="text-slate-500">Sector</p>
              <p className="font-medium text-slate-800">{empresa.sector}</p>
            </div>
            <div>
              <p className="text-slate-500">Tamaño</p>
              <p className="font-medium text-slate-800">{empresa.tamano} ({empresa.numEmpleados} empleados)</p>
            </div>
            <div>
              <p className="text-slate-500">Estado</p>
              <Badge text={empresa.estado} />
            </div>
          </div>
        </div>
      )}

      {/* Recent diagnostics */}
      {diagnosticos.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-blue-600" /> Diagnósticos Recientes
            </h3>
            <Link href="/portal/diagnostico" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {diagnosticos.slice(0, 3).map((d) => (
              <Link key={d._id} href={`/portal/diagnostico/${d._id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{d.codigo}</p>
                  <p className="text-xs text-slate-500">{d.normas?.join(", ")} — {formatDate(d.fechaVisita)}</p>
                </div>
                <div className="flex items-center gap-3">
                  {d.cumplimientoGlobal != null && (
                    <span className="text-sm font-semibold text-blue-600">{d.cumplimientoGlobal}%</span>
                  )}
                  <Badge text={d.estado} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent audits */}
      {auditorias.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-amber-600" /> Auditorías Recientes
            </h3>
            <Link href="/portal/auditoria" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {auditorias.slice(0, 3).map((a) => (
              <Link key={a._id} href={`/portal/auditoria/${a._id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{a.codigo}</p>
                  <p className="text-xs text-slate-500">{a.tipo} — {formatDate(a.fechaInicio)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {a.resultado && <Badge text={a.resultado} />}
                  <Badge text={a.estado} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
