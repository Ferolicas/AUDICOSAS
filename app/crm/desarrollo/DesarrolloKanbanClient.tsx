"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Card, CardContent } from "@/components/crm/ui/card"
import { Button } from "@/components/crm/ui/button"
import { Badge } from "@/components/crm/ui/badge"
import { Progress } from "@/components/crm/ui/progress"
import { PriorityIndicator } from "@/components/crm/shared/PriorityIndicator"
import type { CrmDesarrollo } from "@/lib/crm/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const COLUMNAS = [
  { estado: 'Por hacer', color: 'bg-slate-500', label: 'Por Hacer' },
  { estado: 'En progreso', color: 'bg-blue-500', label: 'En Progreso' },
  { estado: 'En revisión', color: 'bg-yellow-500', label: 'En Revisión' },
  { estado: 'Completado', color: 'bg-green-500', label: 'Completado' },
]

export default function DesarrolloKanbanClient({ proyectos }: { proyectos: CrmDesarrollo[] }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Desarrollo</h1>
          <p className="text-slate-400">Proyectos internos de desarrollo y mejora</p>
        </div>
        <Link href="/crm/desarrollo/nuevo">
          <Button><Plus className="w-4 h-4 mr-2" />Nuevo Proyecto</Button>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNAS.map(col => {
          const items = proyectos.filter(p => p.estado === col.estado)
          return (
            <div key={col.estado} className="min-w-[280px] flex-1">
              <div className={`${col.color} text-white rounded-t-lg px-4 py-2 flex items-center justify-between`}>
                <span className="font-semibold text-sm">{col.label}</span>
                <Badge className="bg-white/20 text-white">{items.length}</Badge>
              </div>
              <div className="bg-slate-700 rounded-b-lg p-3 space-y-3 min-h-[200px]">
                {items.map(p => (
                  <Card key={p._id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm text-slate-100 flex-1">{p.nombre}</h4>
                        <PriorityIndicator priority={p.prioridad as 'Urgente' | 'Alta' | 'Media' | 'Baja'} />
                      </div>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">{p.descripcion}</p>
                      <Badge variant="outline" className="text-xs mb-2">{p.categoria}</Badge>
                      <div className="space-y-1 mt-2">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>Avance</span><span>{p.avance}%</span>
                        </div>
                        <Progress value={p.avance} className="h-1.5" />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-slate-400">
                        <span>{p.responsable}</span>
                        <span>{p.fechaLimite ? format(new Date(p.fechaLimite), 'dd MMM', { locale: es }) : ''}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">Sin proyectos</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
