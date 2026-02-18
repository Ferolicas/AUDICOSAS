"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, ClipboardCheck } from "lucide-react"
import { Card, CardContent } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Input } from "@/components/crm/ui/input"
import { Progress } from "@/components/crm/ui/progress"
import { StatusBadge } from "@/components/crm/shared/StatusBadge"
import type { CrmDiagnostico } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function DiagnosticoListaClient({ diagnosticos }: { diagnosticos: CrmDiagnostico[] }) {
  const [search, setSearch] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("Todos")

  const estados = ["Todos", "Programado", "En ejecución", "Completado", "Cancelado"]

  const filtered = diagnosticos.filter(d => {
    const matchSearch = !search || d.clienteNombre?.toLowerCase().includes(search.toLowerCase()) ||
      d.codigo?.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === "Todos" || d.estado === filtroEstado
    return matchSearch && matchEstado
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Diagnósticos</h1>
          <p className="text-slate-400">Evaluaciones GAP y diagnósticos iniciales</p>
        </div>
        <Link href="/crm/diagnostico/nuevo">
          <Button><Plus className="w-4 h-4 mr-2" />Nuevo Diagnóstico</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Buscar diagnóstico..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <div className="flex gap-2 flex-wrap">
          {estados.map(e => (
            <Button key={e} variant={filtroEstado === e ? "default" : "outline"} size="sm" onClick={() => setFiltroEstado(e)}>
              {e}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <Link key={d._id} href={`/crm/diagnostico/${d._id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-400">{d.codigo}</span>
                  </div>
                  <StatusBadge status={d.estado} />
                </div>
                <h3 className="font-semibold text-slate-100 mb-2">{d.clienteNombre}</h3>
                <div className="flex gap-1 flex-wrap mb-3">
                  {d.normas?.map(n => <Badge key={n} variant="outline" className="text-xs">{n}</Badge>)}
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>Visita: {d.fechaVisita ? format(new Date(d.fechaVisita), 'dd MMM yyyy', { locale: es }) : '-'}</p>
                  <p>Consultor: {d.consultorAsignado}</p>
                </div>
                {d.cumplimientoGlobal != null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Cumplimiento</span><span>{d.cumplimientoGlobal}%</span>
                    </div>
                    <Progress value={d.cumplimientoGlobal} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-8 text-slate-400">No se encontraron diagnósticos</div>
        )}
      </div>
    </div>
  )
}
