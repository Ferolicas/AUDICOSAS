"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Award, ArrowLeft } from "lucide-react"

interface Certificacion {
  _id: string; codigo: string; normas: string[]; faseActual: number; avanceGlobal: number
  consultorLider?: string; fechaInicio: string; fechaObjetivo: string; estado: string
}

const ESTADO_COLORS: Record<string, string> = {
  'Activo': 'bg-blue-100 text-blue-800',
  'Completado': 'bg-green-100 text-green-800',
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

export default function CertificacionListPage() {
  const [items, setItems] = useState<Certificacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/portal/mis-casos")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setItems(data.certificaciones || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/portal" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><ArrowLeft className="w-5 h-5" /></Link>
        <Award className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-slate-800">Mis Certificaciones</h2>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-500">No tienes certificaciones registradas.</div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <Link key={c._id} href={`/portal/certificacion/${c._id}`}
              className="block bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{c.codigo}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{c.normas?.join(", ")}</p>
                  <p className="text-xs text-slate-400 mt-1">Fase {c.faseActual}/6 — {formatDate(c.fechaInicio)} → {formatDate(c.fechaObjetivo)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${c.avanceGlobal}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-1">{c.avanceGlobal}%</p>
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
